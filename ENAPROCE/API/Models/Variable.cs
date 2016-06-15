using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class Variable
    {
        public string idVariableCompuesta { get; set; }
        public string descripcion { get; set; }
        public string nivelDesglose { get; set; }
        public string desglose { get; set; }
    }
}