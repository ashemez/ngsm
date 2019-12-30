package com.entitymatrix.ngsm.lib.servicemanager;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceTree {
	@JsonProperty("name")
	private String name;
	
	@JsonProperty("sid")
	private String sid;
	
	@JsonProperty("status")
	private String status;
	
	@JsonProperty("citype")
	private String citype;
	
	@JsonProperty("consistent")
	private String consistent;
	
	@JsonProperty("badbad")
	private String badbad;
	
	@JsonProperty("badmarginal")
	private String badmarginal;
	
	@JsonProperty("marginalbad")
	private String marginalbad;
	
	@JsonProperty("marginalmarginal")
	private String marginalmarginal;
	
	@JsonProperty("compmodel")
	private String compmodel;
	
	@JsonProperty("source_ci_id")
	private String source_ci_id;
	
	@JsonProperty("hasChild")
	private String hasChild;
	
	@JsonProperty("children")
	private ArrayList<ServiceTree> children;
}
