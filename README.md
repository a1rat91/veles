1. Устанавливаем nodejs https://nodejs.org/en/download/
2. По инструкции устанавливаем https://yarnpkg.com/lang/en/
3. В терминале для Windows __yarn add global gulp__ и для Unix __sudo yarn add global gulp__
4. Клонируем git clone https://github.com/linedotwww/mockup.git
5. Переходим в папку, там командой yarn install устанавливаем все
6. Теперь подключать файлы в __templates/main/source/styles/style.scss__ не нужно, все подключается автоматом
7. Пользовательские стили могут лежать тут __templates/main/source/styles/users__, либо в компонентах
8. В компонентах можно создавать __json__ файлы, пример лежит в __меню__ и потом работать с данными в шаблоне
9. В стилях путь к картинкам не прописываем, только название файла, пути в html файлах можем прописывать как ```html <img src="{{src}}logo.png" alt="" class="logo__pic">```
10. Папка __templates/main/source/js/libs и templates/main/source/js/static__ все содержимое переносится, в __libs__ только библиотеки должны лежать. Папка __/templates/main/source/js/plugins/optional/__ , тут файлы, которые исключены для сборки.
11. Этот файл __templates/main/source/js/static/frontend-works.js__ специальный, сюда складываем __ajax__ и т.д, что в будущем программист перенесет на сайт, так как он потом при натяжке подключаться не будет
12. Для иконок svg используется сервис __https://icongr.am/__ , подключается в стилях просто ```css background: url(https://icongr.am/fontawesome/ambulance.svg?size=34&color=000000);```, плюс использовать можно ```css background: svg-load('auth.svg', fill='#c70000') no-repeat;``` для него файлы svg сохраняем в папку __templates/main/source/images/svg-icons__
13. Настройки лежат тут __main.config.json__
14. Все повтояющиеся блоки выносим в __компоненты__
15. Две команды есть, __gulp__ и __gulp build__
