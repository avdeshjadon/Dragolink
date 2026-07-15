package com.dragolink.service;

import jakarta.servlet.http.HttpServletRequest;

public interface RedirectService {
    String getLongUrlAndRecordClick(String shortCode, HttpServletRequest request);
}
