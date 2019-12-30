package com.entitymatrix.ngsm.app.common;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IndexController {
	
	@GetMapping("/index")
	//public String index(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
	public String index(Model model,
						@RequestParam(name="msbval", required=false, defaultValue="0") String msbval,
						@RequestParam(name="lgval", required=false, defaultValue="1") String lgval,
						@RequestParam(name="page", required=false, defaultValue="1") String page,
						@RequestParam(name="spattern", required=false, defaultValue="") String spattern,
						@RequestParam(name="statusFilter", required=false, defaultValue="0,3,5") String statusFilter
						) {
		model.addAttribute("msbval", msbval);
		model.addAttribute("lgval", lgval);
		model.addAttribute("page", page);
		model.addAttribute("spattern", spattern);
		model.addAttribute("statusFilter", statusFilter);
		return "index";
	}

}

