/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.service;

import jakarta.servlet.http.HttpServletRequest;

public interface RedirectService {
    String getLongUrlAndRecordClick(String shortCode, HttpServletRequest request);
}
