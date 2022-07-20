---
---
	$(document).ready(() => {
		// var lei3Po8h = ["support", ["tuna", "tsinghua", "edu", "cn"].join(".")].join("@");
		// $('a#eib1gieB')
		// 	.text(lei3Po8h)
		// 	.attr('href', atob('bWFpbHRvOgo=') + lei3Po8h);

		$('.selectpicker').selectpicker()

		var mir_tmpl = $("#template").text(),
			label_map = {
				'syncing': 'label-info',
				'success': 'label-success',
				'failed': 'label-warning'
			},
			help_url = {
		{% for h in site.categories['help'] %} "{{h.mirrorid}}": "{{h.url}}"{% if forloop.index < forloop.length %}, {% endif %} {% endfor %}
	},
		new_mirrors = {
		{% for n in site.new_mirrors %}"{{n}}": true{% if forloop.index < forloop.length %}, {% endif %} {% endfor %}
	},
	unlisted = [
	/*
	{
		"name": "maven",
		"is_master": true,
		"status": "success",
		"last_update": "-",
		"upstream": "https://repo1.maven.org/maven2/",
		"exitcode": 0
	},
	{
		"name": "npm",
		"is_master": true,
		"status": "success",
		"last_update": "-",
		"upstream": "https://registry.npmjs.org",
		"exitcode": 0
	},
	{
		"name": "pypi",
		"is_master": true,
		"status": "success",
		"last_update": "-",
		"upstream": "https://pypi.python.org/",
		"exitcode": 0
	},
	{
		"name": "rubygems",
		"is_master": true,
		"status": "success",
		"last_update": "-",
		"upstream": "https://rubygems.org",
		"exitcode": 0
	}
	*/
	],
	options = {
		'maven': { 'url': "/help/maven/" },
		'npm': { 'url': "/help/npm" },
		'pypi': { 'url': "/help/pypi" },
		'rubygems': { 'url': "/help/rubygems" },
		'homebrew': { 'url': "/help/homebrew" }
	},
	descriptions = {
		{% for mir in site.data.mirror_desc %} '{{mir.name}}': '{{mir.desc}}' {% if forloop.index < forloop.length %}, {% endif %} {% endfor %}
	}

var vmMirList = new Vue({
	el: "#mirror-list",
	data: {
		test: "hello",
		mirrorList: []
	},
	created() {
		this.refreshMirrorList();
	},
	updated() {
		$('.mirror-item-label').popover();
	},
	methods: {
		getURL(mir) {
			if (mir.url !== undefined) {
				return mir.url
			}
			return `/${mir.name}/`
		},
		refreshMirrorList() {
			var self = this;
			$.getJSON("/mirrordsync.json", (status_data) => {
				var mirrors = [], mir_data = status_data;
				for (var j in unlisted) {
					mir_data.push(unlisted[j]);
				}
				var mir_uniq = {}; // for deduplication
				mir_data.sort((a, b) => { return a.name < b.name ? -1: 1 });
				var sortable = [];
				for (var j in mir_data) {
					sortable.push([j, mir_data[j]])
				}
				for (var k in sortable) {
					var d = sortable[k][1];
					if (d.status == "disabled") {
						continue;
					}
					if (options[d.name] != undefined) {
						d = $.extend(d, options[d.name]);
					}
					d.label = label_map[d.status];
					d.help_url = help_url[d.name];
					d.is_new = new_mirrors[d.name];
					d.description = descriptions[d.name];
					d.show_status = (d.status != "success");
					if (d.is_master === undefined) {
						d.is_master = true;
					}
					d.last_update = stringifyTime(d.last_update_ts);
					if (d.name in mir_uniq) {
						let other = mir_uniq[d.name];
						if (other.last_update > d.last_update) {
							continue;
						}
					}
					mir_uniq[d.name] = d;
				}
				for (k in mir_uniq) {
					mirrors.push(mir_uniq[k]);
				}
				self.mirrorList = mirrors;
				setTimeout(() => { self.refreshMirrorList() }, 10000);
			});
		}
	}
})


var vmIso = new Vue({     //TODO  isolist needed to be fixed
	el: "#isoModal",
	data: {
		distroList: [],
		selected: {},
		curCategory: "os"
	},
	created: function () {
		var self = this;
		$.getJSON("/isoinfo.json", function (isoinfo) {
			self.distroList = isoinfo;
			self.selected = self.curDistroList[0];
			if (window.location.hash.match(/#iso-download(\?.*)?/)) {
				$('#isoModal').modal();
			}
		});
	},
	computed: {
		curDistroList() {
			return this.distroList
				.filter((x) => x.category === this.curCategory);
		}
	},
	methods: {
		switchDistro(distro) {
			this.selected = distro;
		},
		switchCategory(category) {
			this.curCategory = category;
			this.selected = this.curDistroList[0];
		}
	}
});
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
});

// vim: ts=2 sts=2 sw=2 noexpandtab
