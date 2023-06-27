Unicode true
ManifestSupportedOS all
!include LogicLib.nsh
!include x64.nsh
!include FileFunc.nsh
!macro REG_KEY_VALUE_EXISTS ROOT_KEY SUB_KEY NAME
    ClearErrors
    push $0

    ${If} "${NAME}" == ""
        ${If} ${RunningX64}
            SetRegView 64
            EnumRegKey $0 "${ROOT_KEY}" "${SUB_KEY}" 0
            SetRegView 32
        ${Else}
            SetErrors
        ${EndIf}

        ${If} ${Errors}
            EnumRegKey $0 "${ROOT_KEY}" "${SUB_KEY}" 0
        ${EndIf}
    ${Else}
        ${If} ${RunningX64}
            SetRegView 64
            ReadRegStr $0 "${ROOT_KEY}" "${SUB_KEY}" "${NAME}"
            SetRegView 32
        ${Else}
            SetErrors
        ${EndIf}

        ${If} ${Errors}
            ReadRegStr $0 "${ROOT_KEY}" "${SUB_KEY}" "${NAME}"
        ${EndIf}
    ${EndIf}

    pop $0
!macroend

OutFile "D:\dev\Galos\wixsharp3\Source\src\WixSharp.Samples\Wix# Samples\Bootstrapper\NsisBootstrapper\MyProductArgs.exe"
RequestExecutionLevel none
SilentInstall silent
Function .onInit
InitPluginsDir
${GetParameters} $R0
${GetOptions} "$R0" "/prerequisite:" $R1
File "/oname=$PLUGINSDIR\Payload.txt" "D:\dev\Galos\wixsharp3\Source\src\WixSharp.Samples\Wix# Samples\Bootstrapper\NsisBootstrapper\Assets\Payload.txt"
CreateDirectory "$PLUGINSDIR\Destination"
File "/oname=$PLUGINSDIR\Destination\Payload.txt" "D:\dev\Galos\wixsharp3\Source\src\WixSharp.Samples\Wix# Samples\Bootstrapper\NsisBootstrapper\Assets\Payload.txt"
File "/oname=$PLUGINSDIR\DotNet.ps1" "D:\dev\Galos\wixsharp3\Source\src\WixSharp.Samples\Wix# Samples\Bootstrapper\NsisBootstrapper\Assets\DotNet.ps1"
ExpandEnvStrings $R1 '/log %TEMP%\MyProductArgs_DotNetLog.html $R1'
ExecWait '"powershell.exe" -NoProfile -ExecutionPolicy Bypass -File "$PLUGINSDIR\DotNet.ps1" $R1' $0
primary:
${GetOptions} "$R0" "/primary:" $R1
IfErrors 0 +2
StrCpy $R1 $R0
File "/oname=$PLUGINSDIR\MainProduct.msi" "D:\dev\Galos\wixsharp3\Source\src\WixSharp.Samples\Wix# Samples\Bootstrapper\NsisBootstrapper\MainProduct.msi"
ExpandEnvStrings $R1 '/L*V %TEMP%\MyProductArgs_Msi.log EXEPATH="$EXEPATH" $R1'
ExecWait '"$%WINDIR%\System32\msiexec.exe" /I "$PLUGINSDIR\MainProduct.msi" $R1' $0
SetErrorlevel $0
goto end
end:
FunctionEnd
Section
SectionEnd
