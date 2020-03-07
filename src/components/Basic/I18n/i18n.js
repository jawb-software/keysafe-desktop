import {TEXT} from "./translations";

const dateFormat = require('date-format');

const electron      = require('electron');
const app           = electron.app ? electron.app : electron.remote.app;
const LANG          = app.getLocale();
const DEFAULT_LANG  = 'en';

class I18n {

    //
    // BASICs
    //

    static basic_PasswordCopied(duration){ return I18n._translate('basics.PasswordCopied', duration);}
    static basic_UserNameCopied(duration){ return I18n._translate('basics.UserNameCopied', duration); }
    static basic_PasswordStrength(strength){ return I18n._translate('basics.PasswordScore', strength);}
    static basic_RemoveCategory_Title(){ return I18n._translate('basics.Dialog.RemoveCategory.Title'); }
    static basic_RemoveCategory_ConfirmQuestion(){ return I18n._translate('basics.Dialog.RemoveCategory.Question'); }
    static basic_RemovePassword_Title(){ return I18n._translate('basics.Dialog.RemovePassword.Title'); }
    static basic_RemovePassword_ConfirmQuestion(){ return I18n._translate('basics.Dialog.RemovePassword.Question'); }
    static basic_UnknownError(error){ return I18n._translate('basics.UnknownError') + error; }
    static basic_Cancel(){ return I18n._translate('basics.Cancel'); }
    static basic_Save(){ return I18n._translate('basics.Save'); }
    static basic_Yes(){ return I18n._translate('basics.Yes'); }
    static basic_Changed() { return I18n._translate('basics.Changed'); }
    static basic_NothingFound()  { return I18n._translate('basics.NothingFound'); }

    // APP MENU

    static appMenu_Profile(){ return I18n._translate('menu.Profile'); }
    static appMenu_Profile_New(){ return I18n._translate('menu.Profile.Create'); }
    static appMenu_Profile_Export(){ return I18n._translate('menu.Profile.Export'); }
    static appMenu_Profile_Import(){ return I18n._translate('menu.Profile.Import'); }
    static appMenu_Profile_Settings(){ return I18n._translate('menu.Profile.Settings'); }
    static appMenu_Profile_Logout(){ return I18n._translate('menu.Profile.Logout'); }
    static appMenu_Profile_Exit(){ return I18n._translate('menu.Profile.Exit'); }

    static appMenu_Category(){ return I18n._translate('menu.Category'); }
    static appMenu_Category_New(){ return I18n._translate('menu.Category.New'); }
    static appMenu_Category_Rename(){ return I18n._translate('menu.Category.Rename'); }
    static appMenu_Category_Remove(){ return I18n._translate('menu.Category.Remove'); }

    static appMenu_Password(){ return I18n._translate('menu.Password'); }
    static appMenu_Password_New(){ return I18n._translate('menu.Password.New'); }
    static appMenu_Password_Generator(){ return I18n._translate('menu.Password.Generator'); }

    static appMenu_Help(){return I18n._translate('menu.Help'); }
    static appMenu_Help_ShowDb(){return I18n._translate('menu.Help.ShowDb'); }
    static appMenu_Help_About(){return I18n._translate('menu.Help.About'); }
    static appMenu_Help_About_HowTo(){return I18n._translate('menu.Help.About.HowTo'); }
    static appMenu_Help_About_CryptoInfo(){return I18n._translate('menu.Help.About.CryptoInfo'); }

    //ABOUT
    static aboutKeysafe_Title(){ return I18n._translate('aboutKeysafe.Title'); }
    static aboutKeysafe_Tabs_About(){ return I18n._translate('aboutKeysafe.Tab.About'); }
    static aboutKeysafe_Tabs_OSList(){ return I18n._translate('aboutKeysafe.Tab.OsList'); }
    static aboutKeysafe_Tabs_SourceCode(){ return I18n._translate('aboutKeysafe.Tab.SourceCode'); }

    static aboutKeysafe_About_SourceCode() { return I18n._translate('aboutKeysafe.About.SourceCode'); }
    static aboutKeysafe_About_SourceCode_Button() { return I18n._translate('aboutKeysafe.About.SourceCode.Button'); }
    static aboutKeysafe_About_Frameworks_Title() { return I18n._translate('aboutKeysafe.About.Frameworks.Title'); }
    static aboutKeysafe_About_License_Title() { return I18n._translate('aboutKeysafe.About.License.Title'); }
    static aboutKeysafe_About_License_Text() { return I18n._translate('aboutKeysafe.About.License.Text'); }

    //ABOUT-EncryptionInfo
    static aboutKeysafe_EncryptionInfo_Title(){ return I18n._translate('aboutKeysafe.EncryptionInfo.Title'); }
    static aboutKeysafe_EncryptionInfo_CryptoInfoTitle(){ return I18n._translate('aboutKeysafe.EncryptionInfo.CryptoInfoTitle'); }
    static aboutKeysafe_EncryptionInfo_Example(){ return I18n._translate('aboutKeysafe.EncryptionInfo.Example'); }
    static aboutKeysafe_EncryptionInfo_ExampleTemplate(){ return I18n._translate('aboutKeysafe.EncryptionInfo.ExampleTemplate'); }

    // ABOUT-HOWTO
    static aboutKeysafe_HowTo_Title(){ return I18n._translate('aboutKeysafe.HowTo.Title'); }
    static aboutKeysafe_HowTo_Data() { return I18n._translate('aboutKeysafe.HoTo.Data'); }

    // CATEGORIE LIST

    static categoryList_Title(){ return I18n._translate('categoryList.Title'); }
    static categoryList_Search(){ return I18n._translate('categoryList.Search'); }
    static categoryList_New(){ return I18n._translate('categoryList.NewCategory'); }

    // TOOLBAR - SEARCH

    static searchView_Search(){ return I18n._translate('searchBar.Search'); }

    // PASSWORD LIST

    static passwordList_NoCategories(){ return I18n._translate('passwordList.Info.NoCategories'); }
    static passwordList_Import(){ return I18n._translate('passwordList.Button.Import'); }
    static passwordList_NoPasswords(){ return I18n._translate('passwordList.NoPassword'); }
    static passwordList_NoPasswordsFiltered(filter){ return I18n._translate('passwordList.NoPasswordFound', filter); }
    static passwordList_NewPasswordBtn(){ return I18n._translate('passwordList.Empty.NewPassword'); }
    static passwordList_NewPasswordItem(){ return  I18n._translate('passwordList.NewPassword'); }

    // PASSWORD CARD

    static passwordCard_Menu_Edit(){ return I18n._translate('passwordCard.Menu.Edit'); }
    static passwordCard_Menu_Remove(){ return I18n._translate('passwordCard.Menu.Remove'); }
    static passwordCard_Menu_PwStrength(){ return I18n._translate('passwordCard.Menu.PasswordScore'); }
    static passwordCard_Menu_Move(){ return I18n._translate('passwordCard.Menu.Move'); }

    //
    // IMPORT
    //

    static backupImport_Title() { return I18n._translate('import.Title');}
    static backupImport_Info_Completed() { return  I18n._translate('import.Info.Done'); }
    static backupImport_Info_Done(count) { return  I18n._translate('import.Info.PasswordsImported', count); }
    static backupImport_Info_NoNewPasswordsImported() { return I18n._translate('import.Info.NoNewPasswordsImported'); }
    static backupImport_Info_InProgress() { return I18n._translate('import.Info.InProgress'); }
    static backupImport_Info_PleaseInputPassword() { return I18n._translate('import.Info.PasswordRequired'); }

    static backupImport_Error_ReadingFile(filename) { return I18n._translate('import.Error.WhileReadingFile', filename); }
    static backupImport_Error_NoRequiredPasswordSpecified() { return I18n._translate('import.Error.MissingPassword'); }
    static backupImport_Error_BadPassword() { return I18n._translate('import.Error.BadPassword'); }

    static backupImport_FileFilterName() { return I18n._translate('import.BackupFile.FileFilterName'); }
    static backupImport_Summary_FileName() { return I18n._translate('import.BackupFileSummary.Filename'); }
    static backupImport_Summary_CountCategories() { return I18n._translate('import.BackupFileSummary.CategoriesTotal'); }
    static backupImport_Summary_CountPasswords() { return I18n._translate('import.BackupFileSummary.PasswordsTotal'); }
    static backupImport_Summary_CreatedDate() { return I18n._translate('import.BackupFileSummary.BackupDate'); }

    static backupImport_InputLabel_Password(){ return I18n._translate('import.Input.Password'); }
    static backupImport_InputError_EmptyPassword() { return I18n._translate('import.Input.EmptyPassword');}
    static backupImport_ImportBtn() { return I18n._translate('import.Button.DoImport'); }

    //
    // EXPORT
    //

    static export_SelectFileNameTitle(){ return I18n._translate('export.Title'); }
    static export_ExportingData(){ return I18n._translate('export.Info.InProgress'); }
    static export_DefaultFileName(){
        const dateTemplate = I18n._translate('export.DateFileFormat');
        const dateFormatted = dateFormat.asString(dateTemplate, new Date());
        return 'keysafe_' + dateFormatted + '.ks';
    }
    static export_SuccessfullyExported(fileName){ return I18n._translate('export.Info.Done', fileName); }
    static export_Error(error){ return I18n._translate('export.Error') + error; }

    //
    // SESSION, PROFILE
    //

    static profile_Title(){ return I18n._translate('newProfile.Title'); }
    static profile_Slogan(){ return I18n._translate('newProfile.Slogan'); }
    static profile_Encryption(){ return I18n._translate('newProfile.Info.Encryption'); }

    static profile_EncryptionData(){
        return [
             "AES - Rijndael",
             "Key size       : 256 bit | 32 bytes",
             "Key derivation : PBKDF2WithHmacSHA1",
             "Salt           : 32 bytes (random)",
             "IV             : 16 bytes (random)",
             "Encryption     : AES+CBC+PKCS5Padding"
        ];
    }

    static profile_MasterPwInfo(){ return I18n._translate('newProfile.Info.MasterPassword'); }
    static profile_MasterPwWarning(){ return I18n._translate('newProfile.Warning.MasterPassword'); }
    static profile_Placeholder_ProfileName(){ return I18n._translate('newProfile.Input.Placeholder.ProfileName'); }
    static profile_Placeholder_MasterPw(minPwLength, minPwScore){ return I18n._translate('newProfile.Input.Placeholder.MasterPw', minPwLength, minPwScore); }
    static profile_Placeholder_MasterPw_Confirm(){ return I18n._translate('newProfile.Input.Placeholder.ConfirmMasterPw'); }
    static profile_CreateProfileButton(){ return I18n._translate('newProfile.Button.CreateProfile');}
    static profile_LoginUsingOtherProfile(){ return I18n._translate('newProfile.Button.LoginUsingExistingProfile'); }
    static profile_Msg_ProfileAllreadyExists(){ return I18n._translate('newProfile.Error.ProfileNameExists');}

    //
    // LOGIN
    //

    static login_Error_BadPassword(){ return I18n._translate('login.Error.BadPassword'); }
    static login_Placeholder_MasterPassword(){ return I18n._translate('login.MasterPassword'); }
    static login_Placeholder_ProfileName(){ return I18n._translate('login.ProfileName'); }
    static login_CreateNewProfile(){ return I18n._translate('login.Button.CreateNewProfile'); }
    static login_DoLogin(){ return I18n._translate('login.Button.DoLogin'); }

    //
    // SESSION
    //

    static session_LoadingData(){ return I18n._translate('session.LoadingData'); }
    static session_CleaningData(){ return I18n._translate('session.Cleaning'); }
    static session_Expired(){ return I18n._translate('session.Expired'); }

    static status_LastLogin(){ return I18n._translate('session.LastLogin'); }
    static status_AutoLogout(){ return I18n._translate('session.AutoLogout'); }
    static status_Encryption(){ return I18n._translate('session.EncryptionInfo'); }

    static status_AutoLogout_Off(){ return I18n._translate('session.AutoLogout.Off'); }
    static status_Time_Seconds(){ return I18n._translate('session.AutoLogout.Sec'); }
    static status_Time_Minutes(){ return I18n._translate('session.AutoLogout.Min'); }
    static status_Time_Hours(){ return I18n._translate('session.AutoLogout.Hr'); }
    static status_Time_Days(){ return I18n._translate('session.AutoLogout.Days'); }


    //
    // SETUP PW DIALOG
    //

    static setupPwDialog_Create(){ return I18n._translate('passwordSetup.Title.Create'); }
    static setupPwDialog_Subtitle_Category(categoryName){ return I18n._translate('passwordSetup.SubTitle.Category', categoryName); }
    static setupPwDialog_Edit(){ return I18n._translate('passwordSetup.Title.Edit'); }
    static setupPwDialog_KeyName(){ return I18n._translate('passwordSetup.Placeholder.KeyName'); }
    static setupPwDialog_UserName(){ return I18n._translate('passwordSetup.Placeholder.UserName'); }
    static setupPwDialog_Password(){ return I18n._translate('passwordSetup.Placeholder.Password'); }
    static setupPwDialog_Save(){ return I18n._translate('basics.Save'); }
    static setupPwDialog_Cancel(){ return I18n._translate('basics.Cancel');  }
    static setupPwDialog_Generate(){ return I18n._translate('passwordSetup.Button.Generate'); }
    static setupPwDialog_PasswordNameExists(){ return I18n._translate('passwordSetup.Error.PasswordNameAlreadyExists'); }

    static setupPwDialog_Created(){ return I18n._translate('passwordSetup.Toast.Created'); }
    static setupPwDialog_Changed(){ return I18n._translate('passwordSetup.Toast.Edited'); }
    static setupPwDialog_Removed(){ return I18n._translate('passwordSetup.Toast.Removed'); }

    //
    // MOVE PW
    //
    static movePasswordDialog_Title(){ return I18n._translate('movePasswordDialog.Title'); }
    static movePasswordDialog_CategorySelectLabel(){ return I18n._translate('movePasswordDialog.CategorySelectLabel'); }
    static movePasswordToast_Success(){ return I18n._translate('movePasswordToast.Success'); }

    //
    // PW GENERATOR
    //

    static passwordGenerator_Title(){ return I18n._translate('passwordGenerator.Title'); }
    static passwordGenerator_Copy(){ return I18n._translate('passwordGenerator.Button.Copy'); }
    static passwordGenerator_Copied(){ return I18n._translate('passwordGenerator.Toast.Copied'); }
    static passwordGenerator_Generate(){ return I18n._translate('passwordGenerator.Button.Generate'); }
    static passwordGenerator_UpperCases(){ return I18n._translate('passwordGenerator.Options.UpperCases'); }
    static passwordGenerator_LowerCases(){ return I18n._translate('passwordGenerator.Options.LowerCases'); }
    static passwordGenerator_Digits(){ return I18n._translate('passwordGenerator.Options.Digits'); }
    static passwordGenerator_Symbols(){ return I18n._translate('passwordGenerator.Options.Symbols'); }
    static passwordGenerator_PwLength(){ return I18n._translate('passwordGenerator.Options.Length'); }
    static passwordGenerator_PwScore(){ return I18n._translate('passwordGenerator.Options.RequiredLength'); }

    //
    // PW SCORE
    //
    static passwordScore_Title(){ return I18n._translate('passwordScore.Title'); }
    static passwordScore_RemovedBlackListed(blackListedChars){ return I18n._translate('passwordScore.RemovedBlackListed', blackListedChars); }

    static passwordScore_SectionBonus(){ return I18n._translate('passwordScore.Eval.Bonus'); }
    static passwordScore_PwLength(){ return I18n._translate('passwordScore.Eval.Length'); }
    static passwordScore_UpperCases(){ return I18n._translate('passwordScore.Eval.Uppercases'); }
    static passwordScore_LowerCases(){ return I18n._translate('passwordScore.Eval.Lowercases'); }
    static passwordScore_Digits(){ return I18n._translate('passwordScore.Eval.Digits'); }
    static passwordScore_Symbols(){ return I18n._translate('passwordScore.Eval.Symbols'); }
    static passwordScore_DigitsOrSymbolsInTheMiddle(){ return I18n._translate('passwordScore.Eval.DigitsSymbolsInTheMiddle'); }
    static passwordScore_MinRequirements(){ return I18n._translate('passwordScore.Eval.MinRequirements'); }

    static passwordScore_SectionPenalty(){ return I18n._translate('passwordScore.Deductions');}
    static passwordScore_DigitsOrLettersOnly(){ return I18n._translate('passwordScore.Deductions.DigitsOrLettersOnly'); }
    static passwordScore_consecutiveLC(){ return I18n._translate('passwordScore.Deductions.ConsecutiveLC'); }
    static passwordScore_consecutiveUP(){ return I18n._translate('passwordScore.Deductions.ConsecutiveUC'); }
    static passwordScore_consecutiveDigits(){ return I18n._translate('passwordScore.Deductions.ConsecutiveDigits'); }
    static passwordScore_RepeatChars(){ return I18n._translate('passwordScore.Deductions.RepeatCharacters'); }
    static passwordScore_PwScoreSum(){ return I18n._translate('passwordScore.Sum'); }

    //
    // SETTINGS
    //
    static settings_Title(){ return I18n._translate('settings.Title'); }
    static settings_SectionMain(){ return I18n._translate('settings.Main'); }
    static settings_SectionMainShowUserName(){ return I18n._translate('settings.Main.ShowUserName');}
    static settings_SectionMainShowPassword(){ return I18n._translate('settings.Main.ShowPassword'); }
    static settings_SectionMainShowLastChange(){ return I18n._translate('settings.Main.ShowLastChange'); }
    static settings_SectionMainShowPasswordScore(){ return I18n._translate('settings.Main.ShowPasswordScore'); }
    static settings_SectionMainShowLogout(){ return I18n._translate('settings.Session.AutoLogout'); }
    static settings_SectionSessionTimeout_Off(){ return I18n._translate('settings.Session.AutoLogoutOff'); }
    static settings_SectionSessionTimeout_Sec(sec){ return I18n._translate('settings.Session.AutoLogout.Sec', sec); }
    static settings_SectionSessionTimeout_Min(min){ return I18n._translate('settings.Session.AutoLogout.Min', min); }
    static settings_SectionPwGen(){ return I18n._translate('settings.PwGen'); }
    static settings_SectionProfile(){ return I18n._translate('settings.Profile'); }
    static settings_SectionProfileRemove(){ return I18n._translate('settings.Profile.Remove'); }
    static settings_SectionProfileRemoveInfo(){ return I18n._translate('settings.Profile.Remove.Info'); }
    //
    // CATEGORY
    //
    static category_Title_Change(){ return I18n._translate('categorySetup.Title.Edit'); }
    static category_Title_Create(){ return I18n._translate('categorySetup.Title.Create'); }
    static category_PlaceholderName(){ return I18n._translate('categorySetup.Placeholder.CategoryName'); }
    static category_Msg_CategoryExists(){ return I18n._translate('categorySetup.Error.CategoryAlreadyExists'); }

    static category_Created(){ return I18n._translate('categorySetup.Toast.CategoryCreated'); }
    static category_Removed(){ return I18n._translate('categorySetup.Toast.CategoryRemoved'); }

    static category_Name_Changed(){ return I18n._translate('categorySetup.Toast.CategoryChanged'); }
    static category_Error_Name_NotChanged(){ return I18n._translate('categorySetup.Error.UnknownError'); }

    //
    // REMOVE PROFILE
    //
    static removeProfile_ConfirmButton(){ return I18n._translate('removeProfile.ConfirmButton'); }
    static removeProfile_CancelButton(){ return I18n._translate('removeProfile.CancelButton'); }
    static removeProfile_WarningMsg(profileName){ return I18n._translate('removeProfile.WarningMsg', profileName); }
    static removeProfile_MasterPassword(){ return I18n._translate('removeProfile.MasterPassword'); }

    //
    //
    //

    static _translate(key, arg1, arg2){
        const block = TEXT[key];
        let text  = (block && block[LANG]) || (block && block[DEFAULT_LANG]);

        if(!text){
            return key;
        }

        if(arg1 !== undefined && arg1 !== null){
            text = text.replace('{1}', arg1);
        }
        if(arg2 !== undefined && arg2 !== null){
            text = text.replace('{2}', arg2);
        }
        return text;
    }
}

export default I18n;

