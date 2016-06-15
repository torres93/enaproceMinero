using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
namespace API.Models
{
    public class Dominio
    {
        public string idDominioCompuesta { get; set; }
        public string descripcion { get; set; }
        public string clasificador { get; set; }
        public string desglose { get; set; }
    }
    public class Datos {
        public string dominios { get; set; }
        public string variables { get; set; }
    }
    public class TablaD { 
        public DataTable dt {get; set;}
    }
}