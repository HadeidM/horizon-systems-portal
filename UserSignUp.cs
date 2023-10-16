using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication {

 public partial class usersignup: System.Web.UI.Page {
  // string strcon = ConfigurationManager.ConnectionStrings["con"].ConnectionString;
  string strcon = "Data Source=YourServer;Initial Catalog=YourDatabaseName;User ID=YourUsername;Password=YourPassword";

  protected void Page_Load(object sender, EventArgs e) {
  }
  
  // sign up button click event
  protected void SignUpBtn_Click(object sender, EventArgs e) {
   if (checkMemberExists()) {

    Response.Write("<script>alert('User Already Exist with this username, try other username');</script>");
   } else {
    signUpNewMember();
   }
  }

  // user defined method
  bool checkMemberExists() {
   try {
    SqlConnection con = new SqlConnection(strcon);
    if (con.State == ConnectionState.Closed) {
     con.Open();
    }
    SqlCommand cmd = new SqlCommand("SELECT * from Users where Username='" + TextBox8.Text.Trim() + "';", con);
    SqlDataAdapter da = new SqlDataAdapter(cmd);
    DataTable dt = new DataTable();
    da.Fill(dt);
    if (dt.Rows.Count >= 1) {
     return true;
    } else {
     return false;
    }
   } catch (Exception ex) {
    Response.Write("<script>alert('" + ex.Message + "');</script>");
    return false;
   }
  }

  void signUpNewMember() {
   //Response.Write("<script>alert('Testing');</script>");
   try {
    SqlConnection con = new SqlConnection(strcon);
    if (con.State == ConnectionState.Closed) {
     con.Open();
    }
    SqlCommand cmd = new SqlCommand("INSERT INTO Users(Username, Password, Email, Firstname, Lastname, Phone, Address, RoleID) values(@Username, @Password, @Email, @Firstname, @Lastname, @Phone, @Address, @RoleID)", con);
    cmd.Parameters.AddWithValue("@Username", TextBox1.Text.Trim());
    cmd.Parameters.AddWithValue("@Password", TextBox2.Text.Trim());
    cmd.Parameters.AddWithValue("@Email", TextBox3.Text.Trim());
    cmd.Parameters.AddWithValue("@Firstname", TextBox4.Text.Trim());
    cmd.Parameters.AddWithValue("@Lastname", TextBox5.Text.Trim());
    cmd.Parameters.AddWithValue("@Phone", TextBox6.Text.Trim());
    cmd.Parameters.AddWithValue("@Address", TextBox7.Text.Trim());
    cmd.Parameters.AddWithValue("@RoleID", 2);
    cmd.ExecuteNonQuery();
    con.Close();
    Response.Write("<script>alert('Sign Up Successful. Go to User Login to Login');</script>");
   } catch (Exception ex) {
    Response.Write("<script>alert('" + ex.Message + "');</script>");
   }
  }
 }
}