import {Dimensions, Platform, StatusBar} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Constants from './Constants';
import {Device} from '../config';
import Colors from './Colors';

const {height, width} = Dimensions.get('window');

export const LANDSCAPE = 'landscape';
export const PORTRAIT = 'portrait';

export const getOrientation = () => {
  return width > height ? LANDSCAPE : PORTRAIT;
};

const Styles = {
  width,
  height: Platform.OS !== 'ios' ? height : height - 20,
  navBarHeight: Platform !== 'ios' ? height - width : 0,
  headerHeight: Platform.OS === 'ios' ? 40 : 56,
  statusHeight: StatusBar.currentHeight,

  thumbnailRatio: 1.2, // Thumbnail ratio, the product display height = width * thumbnail ratio

  size: {
    base: 16,
    font: 14,
    radius: 6,
    padding: 25,
  },

  app: {
    flexGrow: 1,
    backgroundColor: Device.isIphoneX ? '#FFF' : '#000',
    paddingTop: Device.ToolbarHeight,
  },
  FontSize: {
    tiny: 12,
    small: 14,
    medium: 16,
    big: 18,
    large: 20,
    h1: 26,
    h2: 20,
    h3: 18,
    title: 18,
    header: 16,
    body: 14,
    caption: 12,
  },
  IconSize: {
    TextInput: 25,
    ToolBar: 18,
    Inline: 20,
    SmallRating: 14,
  },
  FontFamily: {},
};

Styles.Common = {
  Column: {},
  ColumnCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ColumnCenterTop: {
    alignItems: 'center',
  },
  ColumnCenterBottom: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ColumnCenterLeft: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  ColumnCenterRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  Row: {
    flexDirection: 'row',

    ...Platform.select({
      ios: {
        top: Device.isIphoneX ? -15 : 0,
      },
      android: {
        top: 0,
      },
    }),
  },
  RowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RowCenterTop: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  RowCenterBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  RowCenterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RowCenterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  RowCenterBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // More traits

  IconSearchView: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    borderRadius: 50,

    shadowOffset: {width: 0, height: -4},
    shadowColor: 'rgba(0,0,0, .3)',
    elevation: 10,
    shadowOpacity: 0.1,
    zIndex: 9999,
  },
  IconSearch: {
    width: 20,
    height: 20,
    margin: 12,
    zIndex: 9999,
  },

  logo: {
    width: Platform.OS === 'ios' ? 180 : 200,
    height: Platform.OS === 'ios' ? 30 : 30,
    resizeMode: 'contain',
    ...Platform.select({
      ios: {
        marginTop: Device.isIphoneX ? -40 : -4,
      },
      android: {
        marginTop: 2,
        marginLeft: 30,
      },
    }),
  },

  toolbar: (backgroundColor, isDark) => ({
    backgroundColor: isDark ? backgroundColor : '#fff',
    zIndex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    paddingTop: 4,
    borderBottomWidth: isDark ? 0 : 1,
    borderBottomColor: 'transparent',

    ...Platform.select({
      ios: {
        height: Device.isIphoneX ? 5 : 40,
      },
      android: {
        height: 46,
        paddingTop: 0,
        marginTop: 0,
        elevation: 0,
      },
    }),
  }),
  headerTitleStyle: {
    color: '#FFF',
    fontSize: 16,
    height: 40,
    textAlign: 'center',
    fontFamily: Constants.fontFamily,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        marginBottom: 0,
        marginTop: Device.isIphoneX ? -10 : 12,
      },
      android: {
        marginTop: 25,
      },
    }),
  },
  toolbarIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',

    // marginRight: 18,
    // marginBottom: 12,
    marginLeft: 18,
    opacity: 0.8,
    ...Platform.select({
      ios: {
        top: Device.isIphoneX ? -15 : 0,
      },
      android: {
        top: 0,
      },
    }),
  },

  toolbarFloat: {
    position: 'absolute',
    top: 0,
    borderBottomWidth: 0,
    zIndex: 999,
    width,

    ...Platform.select({
      ios: {
        backgroundColor: 'transparent',
        marginTop: Device.isIphoneX ? -15 : -3,
      },
      android: {
        backgroundColor: 'transparent',
        height: 46,
        paddingTop: 0,
      },
    }),
  },
  viewCover: {
    backgroundColor: '#FFF',
    zIndex: 99999,
    bottom: 0,
    left: 0,
    width,
    height: 20,
    // position: "absolute",
  },
  viewCoverWithoutTabbar: {
    backgroundColor: '#FFF',
    zIndex: 99999,
    bottom: 0,
    left: 0,
    width,
    height: 35,
    position: 'absolute',
  },

  viewBack: {
    ...Platform.select({
      ios: {
        marginTop: Device.isIphoneX ? -25 : -5,
      },
    }),
  },
  toolbarIconBack: {
    width: 16,
    height: 16,
    resizeMode: 'contain',

    marginRight: 18,
    marginBottom: 12,
    marginLeft: 18,
    opacity: 0.8,
    ...Platform.select({
      ios: {
        top: Device.isIphoneX ? 4 : 8,
      },
      android: {
        top: 0,
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  text: {
    fontFamily: 'HelveticaNeue',
    color: '#52575D',
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },

  drawerStyle: {
    width: DeviceInfo.isTablet() ? Dimensions.get('window').width * 0.3 : Dimensions.get('window').width * 0.7,
  },
};

export default Styles;
