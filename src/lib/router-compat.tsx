/**
 * react-router-dom compatibility layer.
 *
 * The merged modules from the reference project were written against
 * react-router-dom v6. This stack uses TanStack Router, so `react-router-dom`
 * is aliased (vite + tsconfig) to this module. It implements the subset of the
 * v6 API those modules use, on top of TanStack Router.
 */
import * as React from "react";
import {
  Outlet as TanstackOutlet,
  useRouter,
  useRouterState,
  useParams as useTanstackParams,
} from "@tanstack/react-router";

export { TanstackOutlet as Outlet };

type To = string | { pathname?: string; search?: string; hash?: string };

function toHref(to: To): string {
  if (typeof to === "string") return to;
  return `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`;
}

export function useLocation() {
  const location = useRouterState({ select: (s) => s.location });
  return {
    pathname: location.pathname,
    search: location.searchStr ?? "",
    hash: location.hash ? `#${location.hash}` : "",
    state: (location.state ?? {}) as unknown as Record<string, unknown>,
    key: location.href,
  };
}

export function useNavigate() {
  const router = useRouter();
  return React.useCallback(
    (to: To | number, options?: { replace?: boolean; state?: unknown }) => {
      if (typeof to === "number") {
        router.history.go(to);
        return;
      }
      router.navigate({ href: toHref(to), replace: options?.replace, state: options?.state as never });
    },
    [router],
  );
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  return useTanstackParams({ strict: false } as never) as T;
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => void] {
  const router = useRouter();
  const location = useLocation();
  const params = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const setParams = React.useCallback(
    (next: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => {
      const search = next instanceof URLSearchParams ? next : new URLSearchParams(next);
      const qs = search.toString();
      router.navigate({ href: `${location.pathname}${qs ? `?${qs}` : ""}`, replace: options?.replace });
    },
    [router, location.pathname],
  );
  return [params, setParams];
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: To;
  replace?: boolean;
  state?: unknown;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace, state, onClick, target, children, ...rest },
  ref,
) {
  const router = useRouter();
  const href = toHref(to);
  return (
    <a
      {...rest}
      ref={ref}
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          (target && target !== "_self") ||
          /^([a-z]+:)?\/\//i.test(href)
        ) {
          return;
        }
        event.preventDefault();
        router.navigate({ href, replace, state: state as never });
      }}
    >
      {children}
    </a>
  );
});

type ClassNameProp = string | ((props: { isActive: boolean; isPending: boolean }) => string | undefined);
type StyleProp =
  | React.CSSProperties
  | ((props: { isActive: boolean; isPending: boolean }) => React.CSSProperties | undefined);

export interface NavLinkProps extends Omit<LinkProps, "className" | "style" | "children"> {
  className?: ClassNameProp;
  style?: StyleProp;
  end?: boolean;
  children?: React.ReactNode | ((props: { isActive: boolean; isPending: boolean }) => React.ReactNode);
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, className, style, end, children, ...rest },
  ref,
) {
  const { pathname } = useLocation();
  const target = toHref(to).split("?")[0].split("#")[0];
  const isActive = end ? pathname === target : pathname === target || pathname.startsWith(`${target}/`);
  const renderProps = { isActive, isPending: false };
  return (
    <Link
      {...rest}
      ref={ref}
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={typeof className === "function" ? className(renderProps) : className}
      style={typeof style === "function" ? style(renderProps) : style}
    >
      {typeof children === "function" ? children(renderProps) : children}
    </Link>
  );
});

export function Navigate({ to, replace = true, state }: { to: To; replace?: boolean; state?: unknown }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, to, replace, state]);
  return null;
}

const OutletContext = React.createContext<unknown>(null);

export function useOutletContext<T = unknown>(): T {
  return React.useContext(OutletContext) as T;
}

/** Minimal nested `<Routes>/<Route>` support (path + index + splat). */
export interface RouteProps {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  children?: React.ReactNode;
}

export function Route(_props: RouteProps): React.ReactElement | null {
  return null;
}

/** Score a v6-style path pattern against a pathname. -1 = no match; higher = more specific. */
function scorePath(pattern: string, pathname: string): number {
  if (pattern === "*") return 0;
  const patternParts = pattern.replace(/^\//, "").split("/").filter(Boolean);
  const pathParts = pathname.replace(/^\//, "").split("/").filter(Boolean);
  const splat = patternParts[patternParts.length - 1] === "*";
  const fixed = splat ? patternParts.slice(0, -1) : patternParts;

  if (splat ? pathParts.length < fixed.length : pathParts.length !== fixed.length) return -1;

  let score = 0;
  for (let i = 0; i < fixed.length; i += 1) {
    const part = fixed[i];
    if (part.startsWith(":")) score += 2;
    else if (part === pathParts[i]) score += 3;
    else return -1;
  }
  return splat ? score : score + 1;
}

function flattenRoutes(children: React.ReactNode): React.ReactElement<RouteProps>[] {
  const out: React.ReactElement<RouteProps>[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === React.Fragment) {
      out.push(...flattenRoutes((child.props as { children?: React.ReactNode }).children));
      return;
    }
    out.push(child as React.ReactElement<RouteProps>);
  });
  return out;
}

export function Routes({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const routes = flattenRoutes(children);

  let matched: React.ReactElement<RouteProps> | undefined;
  let best = -1;
  for (const route of routes) {
    const pattern = route.props.index ? "/" : route.props.path;
    if (!pattern) continue;
    const score = scorePath(pattern, pathname);
    if (score > best) {
      best = score;
      matched = route;
    }
  }

  return <>{matched?.props.element ?? null}</>;
}

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const MemoryRouter = BrowserRouter;
export const HashRouter = BrowserRouter;