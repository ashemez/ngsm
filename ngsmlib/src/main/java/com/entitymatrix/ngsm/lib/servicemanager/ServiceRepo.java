package com.entitymatrix.ngsm.lib.servicemanager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.entitymatrix.ngsm.lib.common.RepoBase;


@Repository
public class ServiceRepo extends RepoBase {
	/**
	 * Query event list by filter (if provided)
	 * @param filter
	 * @return List<Event>
	 */
	public List<Service> findServices(String spattern) {
		// pool.participant_code changed to pool.meeting_access_code as partCode
		
		//int offset = page * 12;
		int offset = 0;
		
		StringBuilder sb = new StringBuilder()
					.append("SELECT i.service_instance_id, i.service_instance_name, i.service_instance_displayname,")
					.append(" i.service_template_id, i.current_status, i.citype, i.propagate, i.status_timestamp, i.today_availability")
					.append(" FROM ngsm.service_instances i WHERE");
		/*
			if((!isAdmin || !servicePermissions.containsKey(0)) && (!allowedSrvList.trim().equals("") && !allowedSrvList.trim().equals("0"))) {
				q += " i.service_instance_id IN(" + allowedSrvList + ") AND ";
			}
		 */
		sb.append(" i.citype='CI.BUSINESSMAINSERVICE' ")
			.append(""); // q += " AND i.current_status IN(" + Helper.joinInts(statusFilter, ",") + ")";
		if(!spattern.equals("")) {
			sb.append(" AND i.service_instance_name ILIKE '%\" + spattern + \"%'");
		}
		sb.append(" ORDER BY i.current_status DESC, i.today_availability ASC, i.service_instance_name ASC")
			.append(" LIMIT 12 OFFSET ?");

		List<Service> services = ngsmdsJdbcTemplate.query(
					sb.toString(),
					new ResultSetExtractor<List<Service>>() {

			 			// validate object and add only valid ones
			            @Override
			            public List<Service> extractData(ResultSet rs)
			                    throws SQLException, DataAccessException {
			                List<Service> list = new ArrayList<Service>();  
			                while(rs.next()){
                                Service c = new Service(rs.getInt("service_instance_id"),
                                		rs.getString("service_instance_name"),
                                		rs.getString("service_instance_name"),
                                		0,
                                		rs.getInt("current_status"),
                                		rs.getString("citype"),
                                		0,
                                		100,
                                		false);
                                list.add(c);
                                /*
			                	if(c.Valid(true))
			                		list.add(c);
			                	*/
			                }
			                return list;
			            }
		 			}, offset);
		
		if(services == null)
			services = new ArrayList<Service>();
		
		return services;
	}
	
	public Map<Integer, Integer> getServicesCategoryCount(
			HashMap<Integer, String> servicePermissions,
			String spattern,
			boolean isAdmin) {
		
		String allowedSrvList = "";
		// sid 0 means all services are allowed
		if((!isAdmin || (servicePermissions != null && !servicePermissions.containsKey(0)))) {
			int scnt = 0;
			boolean sidzerocheck = false;
			for(int sid : servicePermissions.keySet()) {
				if(sid == 0) {
					sidzerocheck = true;
				}
				if(scnt > 0)
					allowedSrvList += ",";
				
				allowedSrvList += Integer.toString(sid);
				
				scnt++;
			}
			if(sidzerocheck == true) {
				allowedSrvList = "0";
			}
		}

		StringBuilder sb = new StringBuilder()
				.append("SELECT current_status, count(*) count")
				.append(" FROM ngsm.service_instances")
				.append(" WHERE citype='CI.BUSINESSMAINSERVICE'");
		if((!isAdmin || (servicePermissions != null && !servicePermissions.containsKey(0)) ) && (!allowedSrvList.trim().equals("") && !allowedSrvList.trim().equals("0"))) {
			sb.append(" AND service_instance_id IN(" + allowedSrvList + ") ");
		}
		if(!spattern.equals("")) {
			sb.append(" AND service_instance_name ILIKE '%" + spattern + "%'");
		}
		sb.append(" GROUP BY current_status");
		
		Map<Integer, Integer> categoryList = ngsmdsJdbcTemplate.query(
				sb.toString(),
				new ResultSetExtractor<Map<Integer, Integer>>() {

		 			// validate object and add only valid ones
		            @Override
		            public Map<Integer, Integer> extractData(ResultSet rs)
		                    throws SQLException, DataAccessException {
		            	Map<Integer, Integer> list = new HashMap<Integer, Integer>();  
		                while(rs.next()){
                            list.put(rs.getInt("current_status"), rs.getInt("count"));
		                }
		                return list;
		            }
	 			});
		
		return categoryList;
	}
	
	public Integer GetServiceCount(
			Integer[] statusFilter,
			HashMap<Integer, String> servicePermissions,
			String spattern,
			boolean isAdmin) {
		
    	String allowedSrvList = "";
		// sid 0 means all services are allowed
		if((!isAdmin || (servicePermissions != null && !servicePermissions.containsKey(0))) ) {
			int scnt = 0;
			boolean sidzerocheck = false;
			for(int sid : servicePermissions.keySet()) {
				if(sid == 0) {
					sidzerocheck = true;
				}
				if(scnt > 0)
					allowedSrvList += ",";
				
				allowedSrvList += Integer.toString(sid);
				
				scnt++;
			}
			if(sidzerocheck == true) {
				allowedSrvList = "0";
			}
		}
		
		String statusList = StringUtils.arrayToCommaDelimitedString(statusFilter);
		
		StringBuilder sb = new StringBuilder()
				.append("SELECT count(*) cnt")
				.append(" FROM ngsm.service_instances")
				.append(" WHERE citype='CI.BUSINESSMAINSERVICE'")
				.append(" AND current_status IN(" + statusList + ")");
		if((!isAdmin || (servicePermissions != null && !servicePermissions.containsKey(0)) ) && (!allowedSrvList.trim().equals("") && !allowedSrvList.trim().equals("0"))) {
			sb.append(" AND service_instance_id IN(" + allowedSrvList + ") ");
		}
		if(!spattern.equals("")) {
			sb.append(" AND service_instance_name ILIKE '%" + spattern + "%'");
		}
		
		Integer countOfSrv = ngsmdsJdbcTemplate.query(
				sb.toString(),
				new ResultSetExtractor<Integer>() {

		 			// validate object and add only valid ones
		            @Override
		            public Integer extractData(ResultSet rs)
		                    throws SQLException, DataAccessException {
		            	Integer cnt = 0;  
		                while(rs.next()){
                            cnt = rs.getInt("cnt");
		                }
		                return cnt;
		            }
	 			});
		
		return countOfSrv;
	}
	
}
