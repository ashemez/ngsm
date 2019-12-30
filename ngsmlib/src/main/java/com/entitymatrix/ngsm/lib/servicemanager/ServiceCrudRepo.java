package com.entitymatrix.ngsm.lib.servicemanager;


import javax.transaction.Transactional;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
@Transactional
@ComponentScan("com.entitymatrix.ngsm")
interface ServiceCrudRepo extends CrudRepository <Service, Integer> {
	
	// this is going to be a little complex query
    //@Query("SELECT p FROM Person p WHERE LOWER(p.lastName) = LOWER(:lastName)")
	//public List<Service> find(@Param("lastName") String lastName);
}
