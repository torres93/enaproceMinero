using API.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    public class Response
    {
        public string info { get; set; }
    }
    public class EnaproceController : ApiController
    {
        [Route("api/EnaproceController/getDominio")]
        public IEnumerable<Dominio> getDominio()
        {
            da<Dominio> da = new da<Dominio>();
            try
            {
                IEnumerable<Dominio> ie = da.getData("PR_OBTIENE_DOMINIO", CommandType.StoredProcedure);
                return ie;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Route("api/EnaproceController/getVariable")]
        public IEnumerable<Variable> getVariable([FromBody]string dominio)
        {
            da<Variable> da = new da<Variable>();
            SqlParameter[] @params = new SqlParameter[] { new SqlParameter() { ParameterName = "@DOMINIO", Value = dominio } };

            try
            {
                IEnumerable<Variable> ie = da.getData("PR_OBTIENE_VARIABLE", CommandType.StoredProcedure, @params);
                return ie;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        [Route("api/EnaproceController/getConsulta")]
        public DataTable getConsulta([FromBody]Datos d)
        {
            try
            {
                SqlParameter[] @params = new SqlParameter[] { new SqlParameter() { ParameterName = "@DOMINIO", Value = d.dominios }, new SqlParameter() { ParameterName = "@VARIABLE", Value = d.variables } };
      
                da<DataTable> da = new da<DataTable>();
                DataTable ie = da.getDataTable("PR_CONSULTA_MINERO", CommandType.StoredProcedure, @params);
               
                //string var = dominios.ToString();

                return ie;
            }
            catch (Exception e)
            {
                
                throw;
            }
           
        }
    }
}
