(function(cs_commons, $, undefined) {
	var m_site_url;
	var m_artifact_name;
	var m_artifact_subst;

	// Load fragments (if any).
	function load_fragments() {
		// .csc-fragment elements have HTML injected by loading a
		// fragment document.  These are expected to have the
		// path /subst/artifact_name/fragment_id.html, where artifact_name
		// and fragment_id are the artifact name and fragment name,
		// respectively.
		$(".csc-fragment").each(function(index, elt) {
			console.log("handling csc-fragment element");
			var id = elt.id;
			if (id) {
				console.log("handling element with id " + id);
				$.ajax({
					type : 'GET',
					url : m_site_url + "/subst/" + m_artifact_name + "/" + id + ".html",
					dataType : 'text',
					success : function(data, textStatus, jqXHR) {
						console.log("Received data: " + data);
						// Inject HTML
						$(elt).html(data);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						console.log("Error loading fragment " + id + ":" + textStatus);
					}
				});
			}
		});
	}

	// Do substitutions.
	function do_substitutions() {
		// .csc-subst elements should have their text substituted
		$(".csc-subst").each(function(index, elt) {
			console.log("handling csc-subst element");
			var id = elt.id;
			if (id) {
				console.log("handling element with id " + id);
				var subst_value = m_artifact_subst[id];
				if (subst_value) {
					$(elt).text(subst_value);
				}
			}
		});
	}

	cs_commons.init = function(site_url, artifact_name) {
		// If artifact name isn't defined, then do nothing.
		// This is appropriate for pages that aren't part of a cs-commons
		// artifact.
		if (artifact_name === '') {
			return;
		}

		if (!site_url) throw new Error("site_url must be defined");
		m_site_url = site_url;
		m_artifact_name = artifact_name;

		// Load fragments
		load_fragments();

		// Load artifact substitutions
		$.ajax({
			type : 'GET',
			url : m_site_url + "/subst/" + m_artifact_name + ".json",
			dataType : 'json',
			success : function(data, textStatus, jqXHR) {
				m_artifact_subst = data;
				do_substitutions();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("Error loading substitutions for artifact " + m_artifact_name + ":" + textStatus);
			}
		});
	}
}(window.cs_commons = window.cs_commons || {}, jQuery));

// vim:ts=2:
