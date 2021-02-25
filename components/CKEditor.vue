<template>
  <ckeditor
    :editor="editor"
    :value="value"
    :config="editorConfig"
    @input="(ev) => $emit('input', ev)"
  />
</template>

<script>
let ClassicEditor;
let CKEditor;

if (process.client) {
  ClassicEditor = require("@ckeditor/ckeditor5-build-classic");
  CKEditor = require("@ckeditor/ckeditor5-vue");
} else {
  CKEditor = { component: { template: "<div></div>" } };
}

export default {
  name: "RichEditor",
  props: {
    value: [String],
  },
  components: {
    ckeditor: CKEditor.component,
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        mediaEmbed: {
          previewsInData: true,
        },
        ckfinder: {
          options: {
            resourceType: "Images",
          },
        },
      },
    };
  },
};
</script>

<style>
.ck-content {
  background-color: white;
  color: #000;
  min-height: 300px;
  max-height: 600px;
}
</style>