﻿using Microsoft.AspNetCore.Mvc;

namespace Analyze.Service.Controllers
{
    public class HomeController : Controller
    {
	    public IActionResult Index()
	    {
		    return new RedirectResult("~/swagger");
	    }
	}
}