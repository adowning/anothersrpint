/*
 * Copyright 2015 Anton Tananaev (anton.tananaev@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.andrews.tracker;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;


import com.eros.wx.App;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.LinkedHashMap;
import java.util.Map;

import io.ably.lib.realtime.AblyRealtime;
import io.ably.lib.realtime.Channel;
import io.ably.lib.realtime.CompletionListener;
import io.ably.lib.types.AblyException;
import io.ably.lib.types.ErrorInfo;

public class RequestManager {

    private static final int TIMEOUT = 15 * 1000;
//    Context context = App.getAppContext();

    public interface RequestHandler {
        void onComplete(boolean success);

    }

    private static class RequestAsyncTask extends AsyncTask<String, Void, Boolean> {

        private RequestHandler handler;

        public RequestAsyncTask(RequestHandler handler) {
            this.handler = handler;
        }

        @Override
        protected Boolean doInBackground(String... request) {
            return sendRequest(request[0]);
        }

        @Override
        protected void onPostExecute(Boolean result) {
            handler.onComplete(result);
        }
    }

    public static Map<String, String> splitQuery(URL url) throws UnsupportedEncodingException {
        Map<String, String> query_pairs = new LinkedHashMap<String, String>();
        String query = url.getQuery();
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
        }
        return query_pairs;
    }

    public static void

    updateAbly(String _request) {
        final String request = _request;
        AblyRealtime ably = null;
        try {
            ably = new AblyRealtime("nfET_A.QjvYvA:FPKPdLUkzdvRZHNc");
            Channel channel = ably.channels.get("test");
            channel.publish("locationUpdate", request, new CompletionListener() {
                @Override
                public void onSuccess() {
//                    EventBus.getDefault().post(new LocationUpdateMessage(request));
                }

                @Override
                public void onError(ErrorInfo reason) {
//                    EventBus.getDefault().post(new LocationUpdateMessage(reason));
                }
            });
        } catch (AblyException e) {
            e.printStackTrace();
        }

    }


   public static boolean sendRequest(String request) {
        updateAbly(request);
        InputStream inputStream = null;
        try {

            URL url = new URL(request);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setReadTimeout(TIMEOUT);
            connection.setConnectTimeout(TIMEOUT);
            connection.setRequestMethod("POST");
            connection.connect();
            inputStream = connection.getInputStream();
            while (inputStream.read() != -1);
            return true;
        } catch (IOException error) {
            Log.w(RequestManager.class.getSimpleName(), error.getMessage());
            return false;
        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
            } catch (IOException secondError) {
                Log.w(RequestManager.class.getSimpleName(), secondError);
            }
        }
    }

    public static void sendRequestAsync(String request, RequestHandler handler) {
        RequestAsyncTask task = new RequestAsyncTask(handler);
        task.execute(request);
    }

}
