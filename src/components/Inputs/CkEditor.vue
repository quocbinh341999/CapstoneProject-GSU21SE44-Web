<template>
  <ckeditor :editor="editor" v-model="model" :config="editorConfig" @input="onInput"></ckeditor>
</template>

<script>
import moment from 'moment'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage'
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert'
import ImageResizeEditing from '@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting'
import ImageResizeHandles from '@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles'
import Font from '@ckeditor/ckeditor5-font/src/font'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import Code from '@ckeditor/ckeditor5-basic-styles/src/code'
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript'
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Mention from '@ckeditor/ckeditor5-mention/src/mention'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard'
import firebase from 'firebase'

export default {
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  props: {
    value: [String, Number, Object, Array],
    placeholder: String,
    mentionFeeds: Array
  },
  data () {
    return {
      editor: ClassicEditor,
      editorConfig: {
        placeholder: this.placeholder,
        image: {
          styles: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight'],
          resizeOptions: [
            {
              name: 'imageResize:original',
              value: null,
              icon: 'original'
            },
            {
              name: 'imageResize:25',
              value: '25',
              icon: 'medium'
            },
            {
              name: 'imageResize:50',
              value: '50',
              icon: 'medium'
            },
            {
              name: 'imageResize:75',
              value: '75',
              icon: 'large'
            }
          ],
          toolbar: [
            'imageStyle:full',
            'imageStyle:side',
            '|',
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight',
            '|',
            'imageResize',
            '|',
            'imageTextAlternative'
          ]
        },
        mention: {
          // Configuration...
          feeds: [
            {
              marker: '@',
              feed: this.getFeedItems,
              minimumCharacters: 0,
              itemRenderer: customItemRenderer
            }
          ]
        },
        plugins: [
          Heading,
          EssentialsPlugin,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Code,
          Subscript,
          Superscript,
          Font,
          LinkPlugin,
          ParagraphPlugin,
          ListStyle,
          Mention,
          Image,
          ImageToolbar,
          LinkImage,
          ImageResize,
          ImageResizeEditing,
          ImageResizeHandles,
          ImageStyle,
          ImageCaption,
          ImageInsert,
          Alignment,
          Indent,
          IndentBlock,
          BlockQuote,
          PasteFromOffice,
          Clipboard,
          MentionCustomization
        ],
        toolbar: {
          items: [
            'heading',
            '|',
            'fontfamily',
            'fontsize',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'underline',
            'link',
            '|',
            'alignment',
            'outdent',
            'indent',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'imageInsert',
            'blockQuote',
            '|',
            'undo',
            'redo',
            '|',
            'strikethrough',
            'subscript',
            'superscript'
          ]
        },
        extraPlugins: [MyCustomUploadAdapterPlugin]
      }
    }
  },
  methods: {
    moment,
    getFeedItems (queryText) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const itemsToDisplay = this.mentionFeeds
            .filter(isItemMatching)
            .slice(0, 10)

          resolve(itemsToDisplay)
        }, 100)
      })

      function isItemMatching (item) {
        // item is text or object {name, id}
        const searchString = queryText.toLowerCase()

        if (item.id && item.name) {
          return item.name.toLowerCase().includes(searchString) || item.id.toLowerCase().includes(searchString)
        }
        return item.toLowerCase().includes(searchString)
      }
    },
    onInput (evt) {
      this.$emit('input', evt)
    }
  }
}

function MentionCustomization (editor) {
  // The upcast converter will convert <a class="mention" href="" data-user-id="">
  // elements to the model 'mention' attribute.
  editor.conversion.for('upcast').elementToAttribute({
    view: {
      name: 'span',
      key: 'data-mention',
      classes: 'mention',
      attributes: {
        'data-id': true,
        'data-name': true
      }
    },
    model: {
      key: 'mention',
      value: viewItem => {
        // The mention feature expects that the mention attribute value
        // in the model is a plain object with a set of additional attributes.
        // In order to create a proper object, use the toMentionAttribute helper method:
        const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
          // Add any other properties that you need.
          idOfDB: viewItem.getAttribute('data-mention'),
          id: viewItem.getAttribute('data-id'),
          name: viewItem.getAttribute('data-name')
        })
        return mentionAttribute
      }
    },
    converterPriority: 'high'
  })

  // Downcast the model 'mention' text attribute to a view <a> element.
  editor.conversion.for('downcast').attributeToElement({
    model: 'mention',
    view: (modelAttributeValue, { writer }) => {
      // Do not convert empty attributes (lack of value means no mention).
      if (!modelAttributeValue) {
        return
      }
      return writer.createAttributeElement('span', {
        class: 'mention',
        'data-mention': modelAttributeValue.idOfDB,
        'data-id': modelAttributeValue.id,
        'data-name': modelAttributeValue.name
      }, {
        // Make mention attribute to be wrapped by other attribute elements.
        priority: 20,
        // Prevent merging mentions together.
        id: modelAttributeValue.uid
      })
    },
    converterPriority: 'high'
  })
}

function customItemRenderer (item) {
  const itemElement = document.createElement('span')

  itemElement.classList.add('custom-item')
  itemElement.textContent = `${item.name} `

  // const usernameElement = document.createElement('span')

  // usernameElement.classList.add('custom-item-id')
  // usernameElement.textContent = `(${item.name})`

  // itemElement.appendChild(usernameElement)

  return itemElement
}
class MyUploadAdapter {
  constructor (loader) {
    // The file loader instance to use during the upload.
    this.loader = loader
  }

  // Starts the upload process.
  upload () {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const storage = firebase.storage().ref()
          const uploadTask = storage.child('ckeditor/upload/' + moment() + file.name).put(file)
          uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('Upload is ' + progress + '% done')
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused')
                  break
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running')
                  break
              }
            },
            function (error) {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              // eslint-disable-next-line default-case
              switch (error.code) {
                case 'storage/unauthorized':
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject(" User doesn't have permission to access the object")
                  break

                case 'storage/canceled':
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject('User canceled the upload')
                  break

                case 'storage/unknown':
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject('Unknown error occurred, inspect error.serverResponse')
                  break
              }
            },
            function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                // console.log("File available at", downloadURL);
                resolve({
                  default: downloadURL
                })
              })
            }
          )
        })
    )
  }
}
function MyCustomUploadAdapterPlugin (editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader)
  }
}
</script>
<style>
.ck-editor__editable_inline {
  min-height: 200px;
  max-height: 1000px;
}
.ck-placeholder {
  font-size: 16px;
}
.ck.ck-editor__editable_inline > :first-child {
  margin-top: 0.3rem !important;
}
.ck-editor__editable_inline > p {
  margin-top: 0rem;
  margin-bottom: 0px !important;
  color: black;
}
</style>
