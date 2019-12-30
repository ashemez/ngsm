package com.entitymatrix.ngsm.lib.servicemanager;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Service instance object
 * 
 */
@Entity
@Data
@Builder
//@NoArgsConstructor
@AllArgsConstructor
public class Service {
    @Id
	@JsonProperty("service_instance_id")
	private int service_instance_id;
	
	@JsonProperty("service_instance_name")
	private String service_instance_name;
	
	@JsonProperty("service_instance_displayname")
	private String service_instance_displayname;
	
	@JsonProperty("service_template_id")
	private int service_template_id;
	
	@JsonProperty("current_status")
	private int current_status;
	
	@JsonProperty("ci_type")
	private String ci_type;
	
	@JsonProperty("propagate")
	private int propagate;
	
	@JsonProperty("availability_metric")
	private double availability_metric;
	
	@JsonProperty("hasMaintenance")
	private boolean hasMaintenance;
}
