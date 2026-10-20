<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Marketplace product sharing uses one shared ProductShare menu in the common card renderer; Instagram uses native sharing or clipboard fallback because it has no web share endpoint.
- Share clicks are logged server-side to product_share_events; share links use /product/$id which carries per-product SEO/OG tags then forwards to the product.
