<template>
  <v-card transparent flat min-width="240" max-width="340">
    <v-container grid-list-xs pa-1>
      <v-layout row align-center justify-end fill-height>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('first')" small>{{ $t('bttn.first') }}</v-btn>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('prev')" small
          ><v-icon class="secondary--text" small>fas fa-angle-left</v-icon>
        </v-btn>
        <div v-if="hasInput" class="page-input">
          <v-text-field v-model="pageInput" :mask="inputMask" :placeholder="newPH" :error="!valid(pageInput)" :class="validClass"></v-text-field>
        </div>
        <p v-else class="info--text pr-1">{{ pageInput }}</p>
        <p class="info--text">out of {{ total }}</p>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('next')" small
          ><v-icon class="secondary--text" small>fas fa-angle-right</v-icon>
        </v-btn>
        <v-btn v-if="hasLast" flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('last')" small>{{ $t('bttn.last') }}</v-btn>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import _debounce from 'lodash.debounce'

@Component
export default class AppPaginate extends Vue {
  @Prop(Number) total: number
  @Prop(Number) newPage: number
  @Prop({ type: Boolean, default: true }) hasLast: boolean
  @Prop({ type: Boolean, default: true }) hasInput: boolean

  page = 1
  pageInput = this.page.toString()
  validClass = 'center-input body-1 secondary--text'
  invalidClass = 'center-input body-1 error--text'

  //Methods

  valid(page: number): boolean {
    return page > 0 && page <= this.total
  }

  setPage(): void {
    if (this.valid(parseInt(String(this.pageInput), 10))) {
      this.page = parseInt(String(this.pageInput), 10)
    }
  }

  setPageOnClick(value: string): void {
    switch (value) {
      case 'first':
        this.page = 1
        break
      case 'prev':
        if (this.valid(this.page - 1)) {
          this.page -= 1
        }
        break
      case 'next':
        if (this.valid(this.page + 1)) {
          this.page += 1
        }
        break
      case 'last':
        this.page = this.total
        break
      default:
        break
    }
    this.pageInput = this.page.toString()
  }

  // Watch
  @Watch('pageInput')
  onPageInputChanged(newVal: string, oldVal: string): void {
    const setNewPage = _debounce(this.setPage, 500)
    setNewPage()
  }

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('newPage', newVal)
  }

  @Watch('newPage')
  onNewPageChanged(newVal: number, oldVal: number): void {
    if (this.newPage != this.page) {
      this.pageInput = this.newPage.toString()
    }
  }

  //Computed

  get inputMask(): string {
    let mask = '#'
    while (mask.length != this.total.toString().length) {
      mask += '#'
    }
    return mask
  }

  get newPH(): string {
    const place = this.page.toString()
    return place
  }
}
</script>

<style scoped lang="css">
.v-btn {
  height: 30px;
  min-width: 20px;
  margin: 5px;
}

.page-input{
  width: 80px;
}

p {
  margin: 0;
  padding: 0;
}
</style>
