import ua_parser.Parser;
import ua_parser.Client;
public class UaTest {
    public static void main(String[] args) throws Exception {
        Parser parser = new Parser();
        String[] uas = {
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        };
        for (String ua : uas) {
            Client c = parser.parse(ua);
            System.out.println("---");
            System.out.println("OS: " + c.os.family + " " + c.os.major + "." + c.os.minor);
            System.out.println("Browser: " + c.userAgent.family + " " + c.userAgent.major + "." + c.userAgent.minor);
            System.out.println("Device: " + c.device.family);
        }
    }
}
