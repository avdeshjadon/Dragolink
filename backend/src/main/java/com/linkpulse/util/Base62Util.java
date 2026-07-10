package com.linkpulse.util;

public class Base62Util {
    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int BASE = ALPHABET.length();

    public static String encode(long value) {
        StringBuilder sb = new StringBuilder();
        if (value == 0) {
            return String.valueOf(ALPHABET.charAt(0));
        }
        while (value > 0) {
            sb.append(ALPHABET.charAt((int) (value % BASE)));
            value /= BASE;
        }
        return sb.reverse().toString();
    }
}
