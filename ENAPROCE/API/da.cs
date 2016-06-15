using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;

namespace API
{
    public class da<T>
    {
        private T @class;
        private string connString;
        private SqlConnection cnn = null;
        private SqlCommand cmd = null;

        public string connectionString
        {
            get { return connString; }
            set
            {
                value = value ?? "";
                if (value != string.Empty)
                {
                    connString = value;
                }
                else
                    throw new ArgumentException("the @connectionString cannot be empty or null");
            }
        }

        public da()
        {
            this.connString = ConfigurationManager.ConnectionStrings["enaproce"].ConnectionString;
        }

        public da(string connString)
        {
            this.connString = connString;
        }

        public DataTable getDataTable(string command, CommandType cmdType, SqlParameter[] @params = null)
        {
            DataTable data = new DataTable();
            try
            {
                cnn = new SqlConnection(this.connString);
                cnn.Open();
                cmd = new SqlCommand(command, cnn);
                cmd.CommandType = cmdType;
                if (@params != null)
                {
                    foreach (SqlParameter p in @params)
                    {
                        cmd.Parameters.Add(p);
                    }
                }

                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                if (dr.HasRows)
                {

                    @class = @class == null ? Activator.CreateInstance<T>() : @class;

                    PropertyInfo[] propInfo = @class.GetType().GetProperties();
                    data.Load(dr);
                 
                    dr.Close();
                }

                return data;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cnn != null)
                {
                    cnn.Close();
                    cnn.Dispose();
                }

            }

        }



        public IEnumerable<T> getData(string command, CommandType cmdType, SqlParameter[] @params = null)
        {
            List<T> list = new List<T>();
            try
            {
                cnn = new SqlConnection(this.connString);
                cnn.Open();
                cmd = new SqlCommand(command, cnn);
                cmd.CommandType = cmdType;
                if (@params != null)
                {
                    foreach (SqlParameter p in @params)
                    {
                        cmd.Parameters.Add(p);
                    }
                }

                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                if (dr.HasRows)
                {

                    @class = @class == null ? Activator.CreateInstance<T>() : @class;

                    PropertyInfo[] propInfo = @class.GetType().GetProperties();
                    while (dr.Read())
                    {
                        T t = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in propInfo)
                        {
                            string columnName = prop.Name.ToString();
                            string newColumnName = "";

                            foreach (char c in columnName.ToCharArray())
                            {
                                if (char.IsUpper(c))
                                    newColumnName += "_";
                                newColumnName += char.ToUpper(c);
                            }

                            prop.SetValue(t, dr[newColumnName].ToString());
                        }
                        list.Add(t);
                    }
                    dr.Close();
                }

                return list;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cnn != null)
                {
                    cnn.Close();
                    cnn.Dispose();
                }

            }

        }
    }
}