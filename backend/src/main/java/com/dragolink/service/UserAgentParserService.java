package com.dragolink.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ua_parser.Client;
import ua_parser.Parser;

import jakarta.annotation.PostConstruct;

@Service
@Slf4j
public class UserAgentParserService {

    private Parser parser;

    @PostConstruct
    public void init() {
        try {
            log.info("Initializing User Agent Parser...");
            this.parser = new Parser();
            log.info("User Agent Parser initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize User Agent Parser", e);
        }
    }

    public Client parse(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return null;
        }
        try {
            return parser.parse(userAgent);
        } catch (Exception e) {
            log.warn("Failed to parse User Agent: {}", userAgent);
            return null;
        }
    }

    public String getOs(String userAgent) {
        Client client = parse(userAgent);
        if (client == null || client.os == null || client.os.family == null) return "unknown";
        String osFamily = client.os.family.toLowerCase();
        if (osFamily.contains("mac os") || osFamily.contains("macos")) return "macos";
        if (osFamily.contains("ios")) return "ios";
        if (osFamily.contains("windows")) return "windows";
        if (osFamily.contains("android")) return "android";
        if (osFamily.contains("linux")) return "linux";
        return osFamily;
    }

    public String getDeviceClass(String userAgent) {
        Client client = parse(userAgent);
        if (client == null || client.device == null || client.device.family == null) return "desktop";
        String deviceFamily = client.device.family.toLowerCase();
        
        // uap-java classifies generic items like 'Spider' or 'Generic Smartphone'
        if (deviceFamily.contains("spider") || deviceFamily.contains("bot")) return "bot";
        if (deviceFamily.contains("tablet") || deviceFamily.contains("ipad")) return "tablet";
        if (deviceFamily.contains("phone") || deviceFamily.contains("mobile")) return "mobile";
        
        // Fallback checks for OS-based device guessing if device is "Other"
        String os = getOs(userAgent);
        if (os.equals("ios") || os.equals("android")) {
            // Further distinction based on ua string if device family is "Other"
            if (userAgent.toLowerCase().contains("ipad") || userAgent.toLowerCase().contains("tablet")) {
                return "tablet";
            }
            return "mobile";
        }

        return "desktop"; // Default
    }

    public String getBrowserName(String userAgent) {
        Client client = parse(userAgent);
        if (client == null || client.userAgent == null || client.userAgent.family == null) return "Anonymous";
        return client.userAgent.family;
    }

    public String getBrowserVersion(String userAgent) {
        Client client = parse(userAgent);
        if (client == null || client.userAgent == null || client.userAgent.major == null) return "Unknown";
        String version = client.userAgent.major;
        if (client.userAgent.minor != null) version += "." + client.userAgent.minor;
        return version;
    }

    public String getOsVersion(String userAgent) {
        Client client = parse(userAgent);
        if (client == null || client.os == null || client.os.major == null) return "Unknown";
        String version = client.os.major;
        if (client.os.minor != null) version += "." + client.os.minor;
        return version;
    }
}
