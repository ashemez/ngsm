$(function(){
  /*
   * For the sake keeping the code clean and the examples simple this file
   * contains only the plugin configuration & callbacks.
   * 
   * UI functions ui_* can be located in: demo-ui.js
   */
  $('#drag-and-drop-zone').dmUploader({ //
    url: '/EventCatalogUpload?p=upload',
    maxFileSize: 5000000, // 5 Megs 
    onDragEnter: function(){
      // Happens when dragging something over the DnD area
      this.addClass('active');
    },
    onDragLeave: function(){
      // Happens when dragging something OUT of the DnD area
      this.removeClass('active');
    },
    onInit: function(){
      // Plugin is ready to use
      ui_add_log('Penguin initialized :)', 'info');
    },
    onComplete: function(){
      // All files in the queue are processed (success or error)
      ui_add_log('All pending tranfers finished');
    },
    onNewFile: function(id, file){
      // When a new file is added using the file selector or the DnD area
      ui_add_log('New file added #' + id);
      ui_multi_add_file(id, file);
    },
    onBeforeUpload: function(id){
      // about tho start uploading a file
    	$("#loader").attr('class', 'loader');
      ui_add_log('Starting the upload of #' + id);
      ui_multi_update_file_status(id, 'uploading', 'Uploading...');
      ui_multi_update_file_progress(id, 0, '', true);
    },
    onUploadCanceled: function(id) {
    	$("#loader").attr('class', 'collapse');
      // Happens when a file is directly canceled by the user.
      ui_multi_update_file_status(id, 'warning', 'Canceled by User');
      ui_multi_update_file_progress(id, 0, 'warning', false);
    },
    onUploadProgress: function(id, percent){
      // Updating file progress
    	$("#loader").attr('class', 'loader');
      ui_multi_update_file_progress(id, percent);
    },
    onUploadSuccess: function(id, data){
    	var result = JSON.parse(data);
        // A file was successfully uploaded
    	$("#loader").attr('class', 'collapse');
    	
    	$("#loader").attr('class', 'loader');
    	
    	var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
        if (typeof attr !== typeof undefined && attr !== false) {
        	$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
        }
        
		$.ajax({
			cache: false,
			url:'/EventCatalogUpload?p=process&filename=' + result.filename,
			success:function(udata) {
				var uresult = JSON.parse(udata);
				
				var umsg = "<ul>";
				$.each(uresult, function( key, value ) {
					umsg = umsg + "<li>" + value.message + "</li>";
				});
				umsg = umsg + "</ul>";
				
				$("#modal_upload_message").html(umsg);
				$("#uploadModal").modal("show");
				$.ajax({
					cache: false,
					url:'/Eventcatalog?p=getEventList&filterSid=' + filterSid + '&spattern=',
					success:function(evdata) {
						$("#loader").attr('class', 'loader collapse');
						showEventcatalogList(evdata);
					}
				});
				
			}
		});

      ui_add_log('Server Response for file #' + id + ': ' + result.message + " filename: " + result.filename);
      ui_add_log('Upload of file #' + id + ' COMPLETED', 'success');
      ui_multi_update_file_status(id, 'success', 'Upload Complete');
      ui_multi_update_file_progress(id, 100, 'success', false);
    },
    onUploadError: function(id, xhr, status, message){
    	$("#loader").attr('class', 'collapse');
      ui_multi_update_file_status(id, 'danger', message);
      ui_multi_update_file_progress(id, 0, 'danger', false);  
    },
    onFallbackMode: function(){
      // When the browser doesn't support this plugin :(
      ui_add_log('Plugin cant be used here, running Fallback callback', 'danger');
    },
    onFileSizeError: function(file){
    	$("#loader").attr('class', 'collapse');
      ui_add_log('File \'' + file.name + '\' cannot be added: size excess limit', 'danger');
    }
  });
});