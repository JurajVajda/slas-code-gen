import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {nanoid} from 'nanoid';
import {encode as base64encode} from 'base64-arraybuffer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'slas-code-gen';
  codeVerifier = new FormControl('');
  codeChallenge = new FormControl('');

  selectText(e: FocusEvent) {
    const target = e.currentTarget as HTMLInputElement;
    target?.select();
  }

  /**
   * Creates Code Verifier use for PKCE auth flow.
   *
   * @returns {String} The 128 character length code verifier.
   */
  createCodeVerifier() {
    return nanoid(128);
  }

  /**
   * Creates Code Challenge based on Code Verifier
   *
   * @param {String} codeVerifier
   * @returns {String}
   */
  async generateCodeChallenge(codeVerifier: string) {
    let base64Digest;

    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)

    base64Digest = base64encode(digest)

    return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  async generate() {
    const codeVerifier = this.createCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    this.codeVerifier.setValue(codeVerifier);
    this.codeChallenge.setValue(codeChallenge);
  }
}
