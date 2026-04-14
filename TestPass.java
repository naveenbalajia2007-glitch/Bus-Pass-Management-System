import java.sql.Connection;
import java.sql.DriverManager;

public class TestPass {
    public static void main(String[] args) {
        String[] passwords = {"", "root", "password", "admin", "123456", "1234"};
        for(String p : passwords) {
            try {
                Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/?useSSL=false&allowPublicKeyRetrieval=true", "root", p);
                System.out.println("SUCCESS WITH PASSWORD: '" + p + "'");
                return;
            } catch(Exception e) {
                System.out.println("Failed with password '" + p + "': " + e.getMessage());
            }
        }
        System.out.println("ALL FAILED");
    }
}
