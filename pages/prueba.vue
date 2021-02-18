 <template>
  <div class="container">
    <h1>CKEditor 5 Nuxt Demo</h1>
    <div id="toolbar-container"></div>
    <div id="editor"></div>
  </div>
</template>

<script>
let DecoupledEditor;
if (process.browser) {
  DecoupledEditor = require("@ckeditor/ckeditor5-build-decoupled-document");
}

export default {
  mounted() {
    DecoupledEditor.create(document.querySelector("#editor"))
      .then((editor) => {
        const toolbarContainer = document.querySelector("#toolbar-container");
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  },
};
</script>