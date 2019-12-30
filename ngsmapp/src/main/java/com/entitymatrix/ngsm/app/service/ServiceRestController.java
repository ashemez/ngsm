package com.entitymatrix.ngsm.app.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.entitymatrix.ngsm.app.common.CustomJsonResponseMapper;
import com.entitymatrix.ngsm.lib.servicemanager.ServiceRepo;

@RestController
public class ServiceRestController {
	@Autowired
    ServiceRepo serviceRepo;
	
	@GetMapping("/api/v1/GetFilteredServices")
	public ResponseEntity<?> GetFilteredServices(
			@RequestParam(name="page", required=true, defaultValue="0") Integer page,
			@RequestParam(name="statusFilter", required=true, defaultValue="0,3,5") String statusFilter,
			@RequestParam(name="spattern", required=true, defaultValue="") String spattern,
			@RequestParam(name="pretty") Optional<String> pretty) {
		
		return new ResponseEntity<>(
	            new CustomJsonResponseMapper.PrettyFormattedBody(
	            		serviceRepo.findServices(""),
	            		pretty.isPresent()),
	            HttpStatus.OK);

	}
	
	@GetMapping("/api/v1/PopulateServicesCategoryCount")
	public ResponseEntity<?> PopulateServicesCategoryCount(
			@RequestParam(name="spattern", required=true, defaultValue="") String spattern,
			@RequestParam(name="pretty") Optional<String> pretty) {
		
		return new ResponseEntity<>(
	            new CustomJsonResponseMapper.PrettyFormattedBody(
	            		serviceRepo.getServicesCategoryCount(null, spattern, true),
	            		pretty.isPresent()),
	            HttpStatus.OK);
	}
	
	@GetMapping("/api/v1/GetServiceCount")
	public ResponseEntity<?> GetServiceCount(
			@RequestParam(name="statusFilter", required=false, defaultValue="0,3,5") String statusFilter,
			@RequestParam(name="spattern", required=false, defaultValue="") String spattern,
			@RequestParam(name="pretty") Optional<String> pretty) {
		
		if(statusFilter.trim().equals("")) {
			statusFilter = "0,3,5";
		}
    	String[] statusFilterList = statusFilter.split(",");
    	Integer[] statusFilterArr = new Integer[statusFilterList.length];
    	for(int i = 0; i< statusFilterList.length; i++)
    	{
    		statusFilterArr[i] = Integer.parseInt(statusFilterList[i]);
    	}

		return new ResponseEntity<>(
	            new CustomJsonResponseMapper.PrettyFormattedBody(
	            		serviceRepo.GetServiceCount(statusFilterArr, null, spattern, true),
	            		pretty.isPresent()),
	            HttpStatus.OK);
	}

}
