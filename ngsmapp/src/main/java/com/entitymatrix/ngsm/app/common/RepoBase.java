package com.entitymatrix.ngsm.app.common;

import javax.annotation.Resource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

public abstract class RepoBase {	
	@Resource(name = "ngsmdsJdbcTemplate")
	protected JdbcTemplate ngsmdsJdbcTemplate;
}
