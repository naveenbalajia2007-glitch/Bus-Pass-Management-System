import com.buspass.util.DBConnection;
import java.sql.Connection;

public class TestDB {
    public static void main(String[] args) {
        Connection conn = DBConnection.getConnection();
        if(conn != null) {
            System.out.println("CONNECTION SUCCESS");
        } else {
            System.out.println("CONNECTION FAILURE");
        }
    }
}
