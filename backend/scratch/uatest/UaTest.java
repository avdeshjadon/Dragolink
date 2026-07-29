/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import ua_parser.Parser;
import ua_parser.Client;
public class UaTest {
    public static void main(String[] args) throws Exception {
        Parser parser = new Parser();
        String ua = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36";
        Client c = parser.parse(ua);
        System.out.println("Family: " + c.os.family);
        System.out.println("Major: " + c.os.major);
    }
}
