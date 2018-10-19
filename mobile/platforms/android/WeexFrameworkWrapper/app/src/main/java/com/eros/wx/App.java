package com.eros.wx;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.eros.framework.BMWXApplication;
import com.taobao.weex.WXEnvironment;
import com.taobao.weex.bridge.WXBridgeManager;
import com.taobao.weex.bridge.WXServiceManager;
import com.taobao.weex.common.IWXDebugProxy;
import com.taobao.weex.utils.WXLogUtils;

import java.lang.reflect.Constructor;

/**
 * Created by Carry on 2017/8/23.
 */

public class App extends BMWXApplication {
    public Application mInstance;
    private static Context appContext;
//    public static boolean sRemoteDebugMode; // default close
//    public static String sRemoteDebugProxyUrl; // Debugger Server addresses
    private String TAG = "App";

    @Override
    public void onCreate() {
        super.onCreate();
        mInstance = this;
        appContext = this.getBaseContext();
//        initDebugEnvironment(true, "192.168.1.10"/*"DEBUG_SERVER_HOST"*/);
    }
    public static Context getAppContext() {
        return appContext;
    }

//    private void initDebugEnvironment(boolean enable, String host) {
//        WXEnvironment.sRemoteDebugMode = enable;
//        WXEnvironment.sRemoteDebugProxyUrl = "ws://" + host + ":8088/debugProxy/native";
//    }
//    private void initWXBridge(boolean remoteDebug) {
//        if (remoteDebug && WXEnvironment.isApkDebugable()) {
//            WXEnvironment.sDebugServerConnectable = true;
//        }
//
//        if (mWxDebugProxy != null) {
//            mWxDebugProxy.stop(false);
//        }
//        if (WXEnvironment.sDebugServerConnectable && (WXEnvironment.isApkDebugable() || WXEnvironment.sForceEnableDevTool)) {
//            if (WXEnvironment.getApplication() != null) {
//                try {
//                    Class clazz = Class.forName("com.taobao.weex.devtools.debug.DebugServerProxy");
//                    if (clazz != null) {
//                        Constructor constructor = clazz.getConstructor(Context.class, WXBridgeManager.class);
//                        if (constructor != null) {
//                            mWxDebugProxy = (IWXDebugProxy) constructor.newInstance(
//                                    WXEnvironment.getApplication(), WXBridgeManager.this);
//                            if (mWxDebugProxy != null) {
//                                mWxDebugProxy.start(new WXJsFunctions());
//                            }
//                        }
//                    }
//                } catch (Throwable e) {
//                    //Ignore, It will throw Exception on Release environment
//                }
//                WXServiceManager.execAllCacheJsService();
//            } else {
//                WXLogUtils.e("WXBridgeManager", "WXEnvironment.sApplication is null, skip init Inspector");
//                WXLogUtils.w("WXBridgeManager", new Throwable("WXEnvironment.sApplication is null when init Inspector"));
//            }
//        }
//        if (remoteDebug && mWxDebugProxy != null) {
//            mWXBridge = mWxDebugProxy.getWXBridge();
//        } else {
//            mWXBridge = new WXBridge();
//        }
//    }
//
//    public class RefreshBroadcastReceiver extends BroadcastReceiver {
//        @Override
//        public void onReceive(Context context, Intent intent) {
//            if (IWXDebugProxy.ACTION_INSTANCE_RELOAD.equals(intent.getAction()) ||
//                    IWXDebugProxy.ACTION_DEBUG_INSTANCE_REFRESH.equals(intent.getAction())) {
//                Log.v(TAG, "connect to debug server success");
//                if (mUri != null) {
//                    if (TextUtils.equals(mUri.getScheme(), "http") || TextUtils.equals(mUri.getScheme(), "https")) {
//                        String weexTpl = mUri.getQueryParameter(Constants.WEEX_TPL_KEY);
//                        String url = TextUtils.isEmpty(weexTpl) ? mUri.toString() : weexTpl;
//                        loadWXfromService(url);
//                    } else {
//                        loadWXfromLocal(true);
//                    }
//                }
//            }
//        }
//    }
}
