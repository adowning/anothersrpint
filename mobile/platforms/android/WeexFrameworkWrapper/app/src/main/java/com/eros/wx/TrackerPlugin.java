package com.eros.wx;

import android.Manifest;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.widget.Toast;
import android.support.v4.app.ActivityCompat;

import com.alibaba.weex.plugin.annotation.WeexModule;
import com.andrews.tracker.LocationUpdateMessage;
import com.andrews.tracker.TrackingController;
import com.instapp.nat.geolocation.Constant;
import com.instapp.nat.permission.PermissionChecker;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;
import com.instapp.nat.geolocation.Util;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import com.andrews.tracker.AutostartReceiver;
import com.andrews.tracker.TrackingService;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

/**
 * Created by liuyuanxiao on 2018/5/4.
 */
@WeexModule(name = "TrackerPlugin", lazyLoad = true)
public class TrackerPlugin extends WXModule   {
    private String TAG = "TrackerPlugin";
//    private static Context moduleContext;
    JSCallback mGetCallback;
    JSCallback mWatchCallback;
    HashMap<String, Object> mWatchParam;
    public static final int GET_REQUEST_CODE = 103;
    public static final int WATCH_REQUEST_CODE = 104;
//    EventBus.getDefault().register();
    private AlarmManager alarmManager;
    private PendingIntent alarmIntent;
    private static final int ALARM_MANAGER_INTERVAL = 15000;
    private static final int PERMISSIONS_REQUEST_LOCATION = 2;
    JSCallback jsCallback;
    @JSMethod(uiThread = true)
    public void hello() {
        Toast.makeText(mWXSDKInstance.getContext(), "Hello Eros test Plugin", Toast.LENGTH_LONG).show();
    }


    @JSMethod
    public void startTracker(final JSCallback jsCallback) {
        this.jsCallback = jsCallback;
        EventBus.getDefault().register(this);

        Toast.makeText(mWXSDKInstance.getContext(), "Attempting to start tracker", Toast.LENGTH_LONG).show();
        Log.d(TAG, "hi");
        alarmManager = (AlarmManager) this.mWXSDKInstance.getContext().getSystemService(Context.ALARM_SERVICE);
        alarmIntent = PendingIntent.getBroadcast(mWXSDKInstance.getContext(), 0, new Intent(mWXSDKInstance.getContext(), AutostartReceiver.class), 0);

        boolean b = PermissionChecker.lacksPermissions(mWXSDKInstance.getContext(), Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION);
        if (b) {
            mGetCallback = jsCallback;
            HashMap<String, String> dialog = new HashMap<>();

                dialog.put("title", "Permission Request");
                dialog.put("message", "Please allow the app to get your location");


            PermissionChecker.requestPermissions((Activity) mWXSDKInstance.getContext(), dialog, new com.instapp.nat.permission.ModuleResultListener() {
                @Override
                public void onResult(Object o) {
                    if (o != null && o.toString().equals("true")) {
                        jsCallback.invoke(Util.getError(Constant.LOCATION_PERMISSION_DENIED, Constant.LOCATION_PERMISSION_DENIED_CODE));
                    }
                }
            }, GET_REQUEST_CODE, Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION);
        } else {
            startTrackingService(true, false);
        }


    }
    @Subscribe
    public void onMessageEvent(LocationUpdateMessage event) {
        Log.d(TAG, "gothat mubtha");
        jsCallback.invoke(event);
    }

    private void startTrackingService(boolean checkPermission, boolean permission) {

        if (checkPermission) {
            Log.d(TAG, "checkPermission " + Build.VERSION_CODES.M);

            Set<String> missingPermissions = new HashSet<>();
            if (ContextCompat.checkSelfPermission( mWXSDKInstance.getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "checkPermission 1" );

                missingPermissions.add(Manifest.permission.ACCESS_FINE_LOCATION);
            }
            if (ContextCompat.checkSelfPermission( mWXSDKInstance.getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "checkPermission 2");

                missingPermissions.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            }
            if (missingPermissions.isEmpty()) {
                Log.d(TAG, "checkPermission 3");

                permission = true;
            } else {
                Log.d(TAG, "checkPermission 4");
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Log.d(TAG, "checkPermission 5");
                    mWXSDKInstance.getContext().checkPermission(Manifest.permission.ACCESS_COARSE_LOCATION, 1, 1);

                    mWXSDKInstance.getContext().checkSelfPermission( Manifest.permission.ACCESS_FINE_LOCATION);
                    Log.d(TAG, "checkPermission 6");

                }
                return;
            }
        }

        if (permission) {
            Log.d(TAG, "permission");

//      setPreferencesEnabled(false);
            ContextCompat.startForegroundService( mWXSDKInstance.getContext(), new Intent( mWXSDKInstance.getContext(), TrackingService.class));
            alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
                    ALARM_MANAGER_INTERVAL, ALARM_MANAGER_INTERVAL, alarmIntent);
        } else {
//      sharedPreferences.edit().putBoolean(KEY_STATUS, false).apply();
//      TwoStatePreference preference = (TwoStatePreference) findPreference(KEY_STATUS);
//      preference.setChecked(false);
        }
    }

    private void stopTrackingService() {
        alarmManager.cancel(alarmIntent);
        mWXSDKInstance.getContext().stopService(new Intent( mWXSDKInstance.getContext(), TrackingService.class));
//    setPreferencesEnabled(true);
    }

}
