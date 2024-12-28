{ pkgs, pkgs-2411, atomi }:
let

  all = {
    atomipkgs = (
      with atomi;
      {
        inherit
          mirrord
          swagger_typescript_api
          infisical
          sg
          pls;
      }
    );
    nix-2411 = (
      with pkgs-2411;
      {
        helm = kubernetes-helm;
        inherit
          coreutils
          yq-go
          gnused
          gnugrep
          bash
          jq
          findutils

          git

          bun
          treefmt
          gitlint
          shellcheck
          skopeo
          ;
      }
    );
  };
in
with all;
nix-2411 //
atomipkgs
