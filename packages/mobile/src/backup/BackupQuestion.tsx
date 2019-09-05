import Button, { BtnTypes } from '@celo/react-components/components/Button'
import Link from '@celo/react-components/components/Link'
import SelectionOption from '@celo/react-components/components/SelectionOption'
import colors from '@celo/react-components/styles/colors'
import { fontStyles } from '@celo/react-components/styles/fonts'
import { componentStyles } from '@celo/react-components/styles/styles'
import variables from '@celo/react-components/styles/variables'
import * as React from 'react'
import { WithNamespaces, withNamespaces } from 'react-i18next'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import CeloAnalytics from 'src/analytics/CeloAnalytics'
import { CustomEventNames } from 'src/analytics/constants'
import CancelButton from 'src/components/CancelButton'
import { Namespaces } from 'src/i18n'

const numeral = require('numeral')

type Props = {
  questionNumber?: number
  testWordIndex?: number
  inverse?: boolean
  isCheck?: boolean
  failedNextCheck?: number
  words: string[]
  correctAnswer: string
  onReturnToPhrase: () => void
  onCorrectSubmit: () => void
  onWrongSubmit: () => void
  onCancel: () => void
} & WithNamespaces

interface State {
  selectedAnswer: string | null
  visibleModal: boolean
}

class BackupQuestion extends React.PureComponent<Props, State> {
  static navigationOptions = { header: null }

  state = {
    selectedAnswer: null,
    visibleModal: false,
  }

  eventNames: { [key: string]: { [key: number]: CustomEventNames } } = {
    cancel: {
      1: CustomEventNames.question_cancel1,
      2: CustomEventNames.question_cancel2,
      3: CustomEventNames.question_cancel3,
      4: CustomEventNames.question_cancel4,
    },
    submit: {
      1: CustomEventNames.question_submit1,
      2: CustomEventNames.question_submit2,
      3: CustomEventNames.question_submit3,
      4: CustomEventNames.question_submit4,
    },
    select: {
      1: CustomEventNames.question_select1,
      2: CustomEventNames.question_select2,
      3: CustomEventNames.question_select3,
      4: CustomEventNames.question_select4,
    },
  }

  trackAnalytics(name: string, data: object = {}) {
    if (!this.props.questionNumber) {
      return
    }

    if (
      this.eventNames.hasOwnProperty(name) &&
      this.eventNames[name].hasOwnProperty(this.props.questionNumber)
    ) {
      CeloAnalytics.track(this.eventNames[name][this.props.questionNumber], data)
    } else {
      console.debug(
        `unexpected case for tracking Backup Question ${name}${this.props.questionNumber}`
      )
    }
  }

  cancel = () => {
    this.trackAnalytics('cancel')
    this.props.onCancel()
  }

  onSelectAnswer = (word: string) => {
    this.setState({ selectedAnswer: word })
    this.trackAnalytics('select')
  }

  onSubmit = () => {
    if (this.props.correctAnswer === this.state.selectedAnswer) {
      this.trackAnalytics('submit', { isCorrect: true })
      this.props.onCorrectSubmit()
    } else {
      this.setState({ visibleModal: true })
      this.trackAnalytics('submit', { isCorrect: false })
    }
  }

  onWrongSubmit = () => {
    // PILOT_ONLY
    CeloAnalytics.track(CustomEventNames.question_incorrect)
    this.props.onWrongSubmit()
  }

  render() {
    const { t } = this.props
    return (
      <View style={styles.container}>
        <View style={componentStyles.topBar}>
          <CancelButton onCancel={this.props.onCancel} />
        </View>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.questionTextContainer}>
            {this.props.questionNumber !== undefined && (
              <Text style={[fontStyles.body, styles.question]}>
                {t('question') + ' ' + this.props.questionNumber}
              </Text>
            )}
            {this.props.testWordIndex !== undefined && (
              <Text style={[fontStyles.h1, styles.questionPhrase]}>
                {t('questionPhrase.0') +
                  numeral(this.props.testWordIndex + 1).format('0o') +
                  t('questionPhrase.1')}
              </Text>
            )}
            {this.props.inverse && (
              <Text style={[fontStyles.h1, styles.questionPhrase]}>
                {t('inverseQuestion.0')}
                <Text style={[fontStyles.bold]}>{t('inverseQuestion.1')}</Text>
                {t('inverseQuestion.2')}
              </Text>
            )}
          </View>
          <View style={componentStyles.line} />
          {this.props.words.map((word) => (
            <SelectionOption
              word={word}
              key={word}
              onSelectAnswer={this.onSelectAnswer}
              selected={word === this.state.selectedAnswer}
            />
          ))}
          <View style={styles.modalContainer}>
            <Modal isVisible={this.state.visibleModal === true}>
              <View style={styles.modalContent}>
                <Text style={[styles.modalTitleText, fontStyles.medium]}>{t('checkFailed')}</Text>
                <Text style={styles.modalContentText}>
                  {t('backToKey')}
                  {this.props.isCheck &&
                    this.props.failedNextCheck !== undefined && (
                      <>
                        <Text style={styles.modalContentText}>
                          {t('backupSkipText.0')}
                          <Text style={fontStyles.bold}>{t('backupSkipText.1')}</Text>
                        </Text>
                        <Text style={styles.modalContentText}>
                          {t('checkAgain', { count: this.props.failedNextCheck })}
                        </Text>
                      </>
                    )}
                </Text>
                <View style={styles.modalBottomContainer}>
                  <TouchableOpacity onPress={this.onWrongSubmit}>
                    <Text style={fontStyles.link}>{t('seeBackupKey')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
        <Button
          onPress={this.onSubmit}
          text={t('submit')}
          standard={false}
          type={BtnTypes.PRIMARY}
          disabled={this.state.selectedAnswer ? false : true}
        />
        <View style={styles.forgotButtonContainer}>
          <Text style={fontStyles.bodySmall}>{t('dontKnow')} </Text>
          <Link onPress={this.props.onReturnToPhrase}>
            {this.props.isCheck ? t('seeBackupKey') : t('return')}
          </Link>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  questionTextContainer: {
    paddingHorizontal: 30,
  },
  question: {
    color: colors.dark,
    paddingVertical: 15,
  },
  questionPhrase: {
    color: colors.darkSecondary,
    textAlign: 'left',
  },
  forgotButtonContainer: {
    flexDirection: 'row',
    marginTop: 5,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    width: variables.width - 500,
  },
  modalTitleText: {
    marginTop: 20,
    color: colors.dark,
    fontSize: 18,
    paddingHorizontal: 30,
  },
  modalContentText: {
    marginTop: 30,
    color: colors.darkSecondary,
    fontSize: 16,
    paddingHorizontal: 30,
  },
  modalBottomContainer: {
    margin: 30,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
})

export default withNamespaces(Namespaces.backupKeyFlow6)(BackupQuestion)
