import { Page } from "./Page";
import { EcNamedCurve, generateEcdsaJwkPair, generateRsaJwkPair, RsaModulusLength } from "../lib/jwk";

export class JwkGeneratePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-jwk-generate") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const radioRsa = node.querySelector<HTMLInputElement>('[data-role="radio-rsa"]')!;
    const radioEcdsa = node.querySelector<HTMLInputElement>('[data-role="radio-ecdsa"]')!;
    const wrapRsa = node.querySelector<HTMLElement>('[data-role="wrap-rsa-size"]')!;
    const wrapEcdsa = node.querySelector<HTMLElement>('[data-role="wrap-ecdsa-curve"]')!;
    const selectModulus = node.querySelector<HTMLSelectElement>('[data-role="select-modulus"]')!;
    const selectCurve = node.querySelector<HTMLSelectElement>('[data-role="select-curve"]')!;
    const btnGenerate = node.querySelector<HTMLButtonElement>('[data-role="btn-generate"]')!;
    const btnClear = node.querySelector<HTMLButtonElement>('[data-role="btn-clear"]')!;
    const outPublic = node.querySelector<HTMLElement>('[data-role="out-public"]')!;
    const outPrivate = node.querySelector<HTMLElement>('[data-role="out-private"]')!;

    const updateVisibility = () => {
      wrapRsa.hidden = !radioRsa.checked;
      wrapEcdsa.hidden = radioRsa.checked;
    };
    radioRsa.addEventListener("change", updateVisibility);
    radioEcdsa.addEventListener("change", updateVisibility);
    updateVisibility();

    btnGenerate.addEventListener("click", () => {
      void (async () => {
        btnGenerate.disabled = true;
        try {
          const pair = radioRsa.checked
            ? await generateRsaJwkPair(Number(selectModulus.value) as RsaModulusLength)
            : await generateEcdsaJwkPair(selectCurve.value as EcNamedCurve);
          outPublic.textContent = JSON.stringify(pair.publicKey, null, 2);
          outPrivate.textContent = JSON.stringify(pair.privateKey, null, 2);
        } catch (err) {
          outPublic.textContent = outPrivate.textContent = `Error: ${(err as Error).message}`;
        } finally {
          btnGenerate.disabled = false;
        }
      })();
    });

    btnClear.addEventListener("click", () => {
      outPublic.textContent = "";
      outPrivate.textContent = "";
    });

    container.replaceChildren(node);
  }
}

export const createJwkGeneratePage = (): Page => new JwkGeneratePage();
