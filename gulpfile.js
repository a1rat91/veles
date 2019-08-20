var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var pngquant = require('imagemin-pngquant');
var MozJpeg = require('imagemin-mozjpeg');
var gifsicle = require('imagemin-gifsicle');
var imageminSvgo = require('imagemin-svgo');
var mqPacker = require('css-mqpacker');
var plugins = gulpLoadPlugins();
var browserSync = require('browser-sync').create();
var args = require('yargs').argv;
var config = require('./' + (args.template ? args.template : 'main') + '.config.json').config;

var configWebserver = {
	server: {
		baseDir: config.src.server
	},
	open: false,
	host: 'localhost',
	logPrefix: 'FrontEnd Builder'
};

gulp.task('webserver', () => {
	browserSync.init(configWebserver);
});

gulp.task('mergeJson', () => {
	gulp.src(config.src.source.json.src)
	.pipe(plugins.mergeJson({
		fileName: 'data.json',
		edit: (parsedJson, file) => {
		if (parsedJson.someValue) {
	delete parsedJson.otherValue;
}

return parsedJson;
},
}))
.pipe(gulp.dest(config.src.source.json.dest));
});

gulp.task('js', () => {
	
	gulp.src(config.src.source.js.src)
	.pipe(plugins.plumber({
		errorHandler: (err) => {
		console.log(err)
}
}))
// .pipe(plugins.sourcemaps.init())
.pipe(plugins.concat('script.js'))
	.pipe(plugins.rename('script.min.js'))
	.pipe(plugins.if(config.compress.js, plugins.uglify()))
	// .pipe(plugins.sourcemaps.write('.'))
	.pipe(gulp.dest(config.src.build.js.dest))
	.on('end', browserSync.reload);

gulp.src(config.src.source.js.copy)
	.pipe(gulp.dest(config.src.build.js.dest));
	
});

gulp.task('css', () => {
	
	var cssnano = require('cssnano');
var inlineSvg = require('postcss-inline-svg');
var svgo = require('postcss-svgo');
var cssnext = require('postcss-cssnext');
var imageInliner = require('postcss-image-inliner');

var processors = [
	cssnext({
		warnForDuplicates: false
	}),
	inlineSvg({
		path: config.src.source.svg.dest,
		removeFill: true
	}),
	imageInliner({
		assetPaths: ['https://icongr.am']
	}),
	svgo,
	mqPacker({
		sort: sortMediaQueries
	}),
	cssnano({
		preset: 'advanced',
	})
];

return gulp.src(config.src.source.css.src)
	.pipe(plugins.plumber({
		errorHandler: (err) => {
		console.log(err)
}
}))
// .pipe(plugins.sourcemaps.init())
.pipe(plugins.sassGlob({
	ignorePaths: [
		'./templates/main/source/styles/base/variables.scss',
		'./templates/main/source/styles/base/mixins.scss'
	]
}))
	.pipe(plugins.sass())
	.pipe(plugins.postcss(processors))
	// .pipe(plugins.cssUrlChange({
	// 	prepend: '../images/'
	// }))
	// .pipe(plugins.sourcemaps.write('.'))
	.pipe(gulp.dest(config.src.build.css.dest))
	.pipe(browserSync.reload({ stream: true }));
});

var configHtml = {
	'indent_size': 1,
	'indent_char': '\t',
	'brace_style': 'expand',
	'space_before_conditional': false,
	'unformatted': ['sub', 'sup', 'b', 'u', 'span', 'a', 'br']
}

// De-caching for Data files
function requireUncached( $module ) {
	delete require.cache[require.resolve( $module )];
	return require( $module );
}

gulp.task('ajax', () => {
	return gulp.src(config.src.source.ajax.src)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
			console.log(err)
}
}))
.pipe(
	plugins.data(function() {
		return requireUncached(config.src.source.json.file);
	})
)
	.pipe(plugins.nunjucksRender({
		path: [config.src.source.components],
		data: {
			src: "images/"
		}
	}))
	.pipe(plugins.htmlPrettify(configHtml))
	.pipe(gulp.dest(config.src.build.ajax.dest))
	
});

gulp.task('nunjucks', () => {
	
	return gulp.src(config.src.source.html.src)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
			console.log(err)
}
}))
.pipe(
	plugins.data(function() {
		return requireUncached(config.src.source.json.file);
	})
)
	.pipe(plugins.nunjucksRender({
		path: [config.src.source.components],
		data: {
			src: "images/"
		}
	}))
	.pipe(plugins.htmlPrettify(configHtml))
	.pipe(gulp.dest(config.src.build.dest))
	.on('end', browserSync.reload);
	
});

gulp.task('fonts', () => {
	return gulp.src(config.src.source.fonts.src)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
			console.log(err)
}
}))
.pipe(gulp.dest(config.src.build.fonts.dest));
});

gulp.task('data', () => {
	return gulp.src(config.src.source.data.src)
		.pipe(plugins.changedInPlace())
		.pipe(plugins.plumber({
			errorHandler: (err) => {
			console.log(err)
}
}))
.pipe(gulp.dest(config.src.build.data.dest));
});

gulp.task('images', () => {
	
	return gulp.src(config.src.source.images.src)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
			console.log(err)
}
}))
.pipe(plugins.cache(plugins.imagemin([
	plugins.imagemin.gifsicle({
		interlaced: true
	}),
	MozJpeg({
		quality: 90
	}),
	plugins.imagemin.optipng({
		optimizationLevel: 5
	}),
	plugins.imagemin.svgo({
		plugins: [{ removeViewBox: true }]
	})
])))
	.pipe(gulp.dest(config.src.build.images.dest))
	.on('end', browserSync.reload);
});

gulp.task('svg', () => {
	return gulp.src(config.src.source.svg.src)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
			console.log(err)
}
}))
.pipe(plugins.svgmin())
	.pipe(gulp.dest(config.src.source.svg.dest));
});

// Basic configuration example
var configSvg = {
	mode: {
		css: {
			render: {
				css: true
			}
		},
		symbol: true
	}
};

gulp.task('svgSprite', () => {
	return gulp.src(config.src.source.svg.sprite.src, { cwd: '' })
		.pipe(plugins.plumber({
			errorHandler: (err) => {
			console.log(err)
}
}))
.pipe(plugins.svgSprite(configSvg))
	.on('error', function (error) {
		console.log(error)
	})
	
	.pipe(gulp.dest(config.src.source.svg.sprite.dest));
});

gulp.task('watch:nunjucks', () => {
	plugins.watch(config.src.watch.html, () => {
	gulp.start('nunjucks');
});
});

gulp.task('watch:ajax', () => {
	plugins.watch(config.src.watch.ajax, () => {
	gulp.start('ajax');
});
});

gulp.task('watch:css', () => {
	plugins.watch(config.src.watch.css, () => {
	gulp.start('css');
});
});

gulp.task('watch:js', () => {
	plugins.watch(config.src.watch.js, () => {
	gulp.start('js');
});
});

gulp.task('watch:images', () => {
	plugins.watch(config.src.watch.images, () => {
	gulp.start('images');
});
});

gulp.task('watch:mergeJson', () => {
	plugins.watch(config.src.source.json.src, () => {
	gulp.start('mergeJson');
});
});

gulp.task('watch', () => {
	plugins.watch(config.src.watch.json.src, () => {
	gulp.start('mergeJson');
});
plugins.watch(config.src.watch.json.dest, () => {
	gulp.start('nunjucks');
gulp.start('ajax');
});
plugins.watch(config.src.watch.data, () => {
	gulp.start('data');
});
plugins.watch(config.src.watch.images, () => {
	gulp.start('images');
});
plugins.watch(config.src.source.svg.src, () => {
	gulp.start('svg');
});
plugins.watch(config.src.watch.html, () => {
	gulp.start('nunjucks');
});
plugins.watch(config.src.watch.ajax, () => {
	gulp.start('ajax');
});
plugins.watch(config.src.watch.css, () => {
	gulp.start('css');
});
plugins.watch(config.src.watch.js, () => {
	gulp.start('js');
});
});

gulp.task('build:clean', () => {
	gulp.src(config.src.build.dest)
	.pipe(plugins.clean());
});

gulp.task('default', ['watch', 'webserver']);
gulp.task('build', ['svg', 'fonts', 'images', 'js', 'nunjucks', 'css', 'ajax', 'data']);


function isMax(mq) {
	
	return /max-width/.test(mq);
	
}

function isMin(mq) {
	
	return /min-width/.test(mq);
	
}

function sortMediaQueries(a, b) {
	
	let A = a.replace(/\D/g, '');
	
	let B = b.replace(/\D/g, '');
	
	if (isMax(a) && isMax(b)) {
		
		return B - A;
		
	} else if (isMin(a) && isMin(b)) {
		
		return A - B;
		
	} else if (isMax(a) && isMin(b)) {
		
		return 1;
		
	} else if (isMin(a) && isMax(b)) {
		
		return -1;
		
	}
	
	return 1;
	
}
