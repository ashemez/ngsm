package com.entitymatrix.ngsm.lib.common;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.entitymatrix.ngsm.lib.servicemanager.ServiceTree;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Common data transfer object for API responding points
 * @author kursa
 *
 * @param <T>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO {
	private Integer statusCode;
	
    private Integer errorId;

    @Builder.Default
    private String message = "Success!";

    //private T body;
    
	private static final Logger log = LoggerFactory.getLogger("jsonLogger");
	
    @Override
    public String toString() {
    	ObjectMapper om = new ObjectMapper();
    	String jsonString = "";
    	try {
			jsonString = om.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			log.error("Error while converting to JSON: " + e.getMessage());
			return this.toString();
		}
    	return jsonString;
    }
}
