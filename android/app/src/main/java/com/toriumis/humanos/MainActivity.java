package com.toriumis.humanos;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * HUMAN OS — WebView shell.
 * The entire web app (web/) is bundled into assets/web/ at build time
 * (see .github/workflows/android-build.yml), so the app works fully offline.
 */
public class MainActivity extends Activity {

    private WebView web;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true); // localStorage for training history
        web.setWebViewClient(new WebViewClient());
        web.setBackgroundColor(0xFF0A0C11);
        web.loadUrl("file:///android_asset/web/index.html");
        setContentView(web);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && web.canGoBack()) {
            web.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
