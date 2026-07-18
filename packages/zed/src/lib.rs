// @file packages/zed/src/lib.rs
// @description FCSS Zed extension — registers the FCSS language server and returns the Node launch command.
// @layer adapters
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

use zed_extension_api::{self as zed, LanguageServerId, Result, Worktree};

struct FcssExtension;

impl zed::Extension for FcssExtension {
    fn new() -> Self {
        FcssExtension
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &LanguageServerId,
        worktree: &Worktree,
    ) -> Result<zed::Command> {
        let node = worktree.which("node").ok_or_else(|| {
            "Node.js not found on PATH. \
             Install Node.js (https://nodejs.org) and ensure it is on your PATH, \
             then run `npm install @fcss/core @fcss/lsp-server` in your project."
                .to_string()
        })?;

        // Verify the package is installed before constructing the full server path.
        // A missing package.json means `dist/server.js` won't exist either.
        worktree
            .read_text_file("node_modules/@fcss/lsp-server/package.json")
            .map_err(|_| {
                "@fcss/lsp-server is not installed in this project. \
                 Run `npm install @fcss/core @fcss/lsp-server` (or the equivalent \
                 for your package manager) in your project root."
                    .to_string()
            })?;

        let server_path = format!(
            "{}/node_modules/@fcss/lsp-server/dist/server.js",
            worktree.root_path()
        );

        Ok(zed::Command {
            command: node,
            args: vec![server_path],
            env: vec![],
        })
    }
}

zed::register_extension!(FcssExtension);
