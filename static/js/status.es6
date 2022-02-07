---
---
$(document).ready(() => {
	var mir_tmpl = $("#template").text();
	var stringifyTime = function (ts) {
		var date = new Date(ts * 1000);
		var str = "";
		var ago = "";
		if (date.getFullYear() > 2000) {
			str = `${('000' + date.getFullYear()).substr(-4)}-${('0' + (date.getMonth() + 1)).substr(-2)}-${('0' + date.getDate()).substr(-2)}` +
				` ${('0' + date.getHours()).substr(-2)}:${('0' + date.getMinutes()).substr(-2)}`;
		} else {
			str = "0000-00-00 00:00";
		}
		return str;
	}
	window.refreshMirrorList = () => {
		$.getJSON("/mirrordsync.json", (status_data) => {
			var mirrors=[], mir_data=status_data;
			mir_data.sort((a, b) => { return a.name < b.name ? -1: 1 });
			for(var k in mir_data) {
				var d = mir_data[k];
				if (d.is_master === undefined) {
					d.is_master = true;
				}
				// Strip the second component of last_update
				d.last_update = stringifyTime(d.last_update_ts);
				mirrors.push(d);
			}
			var result = Mark.up(mir_tmpl, {mirrors: mirrors});
			$('#mirror-list').html(result);
		});
		setTimeout(refreshMirrorList, 10000);
	};
	refreshMirrorList();
});
