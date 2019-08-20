var addEl = function (tagname, attrs, html, parent) {

	var tag,
		i;

	tag = document.createElement(tagname);

	for (i in attrs) {
		if (attrs.hasOwnProperty(i)) {
			tag.setAttribute(i, attrs[i]);
		}
	}

	tag.innerHTML = html;

	if (parent) {
		parent.appendChild(tag);
	}

	return tag;
};

var detectMobile = /Android|iPhone|iPad|iPod|BlackBerry|WPDesktop|IEMobile|Opera Mini/i.test(navigator.userAgent) && screen.width < 768;

var head = document.querySelector('head');

if(detectMobile) {
	addEl('meta', { name: 'HandheldFriendly', content: 'True' }, '', head);
	addEl('meta', { name: 'format-detection', content: 'telephone=yes' }, '', head);
	addEl('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }, '', head);
	addEl('meta', { name: 'MobileOptimized', content: '320' }, '', head);
	addEl('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }, '', head);
}
