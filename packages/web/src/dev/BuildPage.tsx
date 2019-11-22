import * as React from 'react'
import { View } from 'react-native'
import Cover from 'src/dev/Cover'
import Engage from 'src/dev/Engage'
import Features from 'src/dev/Features'
import FullStack from 'src/dev/FullStack'
import OpenGraph from 'src/header/OpenGraph'
import { I18nProps, withNamespaces } from 'src/i18n'
import ConnectionFooter from 'src/shared/ConnectionFooter'
import menuItems from 'src/shared/menu-items'

class BuildPage extends React.PureComponent<I18nProps> {
  static getInitialProps() {
    return { namespacesRequired: ['common', 'dev'] }
  }

  render() {
    return (
      <View
        style={{
          // @ts-ignore
          scrollPadding: 20,
        }}
      >
        <OpenGraph
          path={menuItems.BUILD.link}
          title={'Build with Celo | Celo Developers'}
          description={
            "Documentation for Celo's open-source protocol. Celo is a proof-of-stake based blockchain with smart contracts that allows for an ecosystem of powerful applications built on top."
          }
        />
        <Cover />
        <StackExplorer />
        <View style={standardStyles.darkBackground}>
          <Features />
          <Title nativeID={hashNav.build.stack} invert={true} title={t('celoStack')} />
          <StackSection
            label="1"
            id={hashNav.build.applications}
            title={t('mobile.title')}
            text={t('mobile.text')}
            buttonOne={{ title: t('installWallet'), href: CeloLinks.walletApp }}
            buttonTwo={{ title: t('seeCode'), href: CeloLinks.monorepo }}
          >
            <Li style={textStyles.readingOnDark}>{t('mobile.nonCustodial')}</Li>
            <Li style={textStyles.readingOnDark}>{t('mobile.mobileUltra')}</Li>
            <Li style={textStyles.readingOnDark}>{t('mobile.exchange')}</Li>
            <Li style={textStyles.readingOnDark}>{t('mobile.qr')}</Li>
          </StackSection>
          <StackSection
            label="2"
            id={hashNav.build.contracts}
            title={t('protocol.title')}
            text={t('protocol.text')}
            buttonOne={{ title: t('readMore'), href: CeloLinks.docsOverview }}
            buttonTwo={{ title: t('seeCode'), href: CeloLinks.monorepo }}
          >
            <Li style={textStyles.readingOnDark}>{t('protocol.algoReserve')}</Li>
            <Li style={textStyles.readingOnDark}>{t('protocol.cryptoCollat')}</Li>
            <Li style={textStyles.readingOnDark}>{t('protocol.native')}</Li>
          </StackSection>
          <StackSection
            label="3"
            id={hashNav.build.blockchain}
            title={t('proof.title')}
            text={t('proof.text')}
            buttonOne={{ title: t('readMore'), href: CeloLinks.docsOverview }}
            buttonTwo={{ title: t('seeCode'), href: CeloLinks.blockChainRepo }}
          >
            <Li style={textStyles.readingOnDark}>{t('proof.permissionless')}</Li>
            <Li style={textStyles.readingOnDark}>{t('proof.rewardsWeighted')}</Li>
            <Li style={textStyles.readingOnDark}>{t('proof.onChain')}</Li>
          </StackSection>
        </View>
        <DeveloperUpdates />
        <Engage />
        <FullStack />
        <Features />
        <ConnectionFooter includeDividerLine={false} />
      </View>
    )
  }
}

export default withNamespaces('dev')(BuildPage)
