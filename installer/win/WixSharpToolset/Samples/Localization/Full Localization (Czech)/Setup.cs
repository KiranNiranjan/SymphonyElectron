/*਍ 䈀愀猀攀搀 漀渀 琀栀攀 挀漀搀攀 猀愀洀瀀氀攀 挀漀渀琀爀椀戀甀琀攀搀 戀礀 圀椀砀⌀ 甀猀攀爀 䬀漀猀洀愀欀 䴀愀爀琀椀渀 昀爀漀洀 䌀稀攀挀栀 刀攀瀀甀戀氀椀挀⸀ഀഀ
 */਍ഀഀ
using System;਍甀猀椀渀最 匀礀猀琀攀洀⸀堀洀氀㬀ഀഀ
using Microsoft.Win32;਍甀猀椀渀最 匀礀猀琀攀洀⸀圀椀渀搀漀眀猀⸀䘀漀爀洀猀㬀ഀഀ
using Microsoft.Deployment.WindowsInstaller;਍甀猀椀渀最 匀礀猀琀攀洀⸀刀攀猀漀甀爀挀攀猀㬀ഀഀ
using WixSharp;਍ഀഀ
class Script਍笀ഀഀ
    static public void Main(string[] args)਍    笀ഀഀ
਍        琀爀礀ഀഀ
        {਍            猀琀爀椀渀最 氀愀渀最 㴀 ∀挀猀ⴀ䌀娀∀㬀 ⼀⼀ 搀攀琀攀爀洀椀渀攀 氀愀渀最甀愀最攀 氀漀挀愀氀椀稀愀琀椀漀渀ഀഀ
਍            ⼀⼀最攀琀 愀挀挀攀猀猀 琀漀 䌀䰀刀 爀攀猀漀甀爀挀攀 昀椀氀攀ഀഀ
            var resPath = "Resource." + lang + ".resx"; // path to resource if buildинг from command prompt਍            椀昀 ⠀℀匀礀猀琀攀洀⸀䤀伀⸀䘀椀氀攀⸀䔀砀椀猀琀猀⠀爀攀猀倀愀琀栀⤀⤀ഀഀ
                Environment.CurrentDirectory = @"..\..\"; // path to resource if buildинг from Visual Studio਍ഀഀ
            var rs = new ResXResourceSet(resPath);਍ഀഀ
            //Prepare features਍ഀഀ
            // binaries਍            䘀攀愀琀甀爀攀 戀椀渀愀爀椀攀猀 㴀 渀攀眀 䘀攀愀琀甀爀攀ഀഀ
                                {਍                                    一愀洀攀 㴀 爀猀⸀䜀攀琀匀琀爀椀渀最⠀∀䘀攀愀琀䄀瀀瀀一愀洀攀∀⤀Ⰰഀഀ
                                    ConfigurableDir = "APPLICATIONROOTDIRECTORY",    // this enables customization of installation folder਍                                    䐀攀猀挀爀椀瀀琀椀漀渀 㴀 爀猀⸀䜀攀琀匀琀爀椀渀最⠀∀䘀攀愀琀䄀瀀瀀䐀攀猀挀∀⤀ഀഀ
                                };਍            ⼀⼀ 愀瀀瀀氀椀挀愀琀椀漀渀 搀愀琀愀ഀഀ
            Feature datas = new Feature਍                             笀ഀഀ
                                 Name = rs.GetString("FeatDataName"),਍                                 䐀攀猀挀爀椀瀀琀椀漀渀 㴀 爀猀⸀䜀攀琀匀琀爀椀渀最⠀∀䘀攀愀琀䐀愀琀愀䐀攀猀挀∀⤀ഀഀ
                             };਍ഀഀ
            //documentation਍            䘀攀愀琀甀爀攀 搀漀挀猀 㴀 渀攀眀 䘀攀愀琀甀爀攀ഀഀ
                            {਍                                一愀洀攀 㴀 爀猀⸀䜀攀琀匀琀爀椀渀最⠀∀䘀攀愀琀䐀漀挀一愀洀攀∀⤀Ⰰഀഀ
                                Description = rs.GetString("FeatDocDesc")਍                            紀㬀ഀഀ
            //shortcuts਍            䘀攀愀琀甀爀攀 猀栀漀爀琀挀甀琀猀 㴀 渀攀眀 䘀攀愀琀甀爀攀ഀഀ
                {਍                    一愀洀攀 㴀 爀猀⸀䜀攀琀匀琀爀椀渀最⠀∀䘀攀愀琀匀栀漀爀琀挀甀琀一愀洀攀∀⤀Ⰰഀഀ
                    Description = rs.GetString("FeatShortcutDesc")਍                紀㬀ഀഀ
਍            ⼀⼀ 倀爀攀瀀愀爀攀 瀀爀漀樀攀挀琀ഀഀ
            Project project =਍                渀攀眀 倀爀漀樀攀挀琀⠀∀䰀漀挀愀氀椀稀愀琀椀漀渀吀攀猀琀∀Ⰰഀഀ
਍                    ⼀⼀䘀椀氀攀猀 愀渀搀 匀栀漀爀琀挀甀琀猀ഀഀ
                    new Dir(new Id("APPLICATIONROOTDIRECTORY"), @"%ProgramFiles%\LocalizationTest",਍ഀഀ
                        // application binaries਍                        渀攀眀 䘀椀氀攀⠀戀椀渀愀爀椀攀猀Ⰰ 䀀∀䄀瀀瀀䘀椀氀攀猀尀䈀椀渀尀䴀礀䄀瀀瀀⸀攀砀攀∀Ⰰഀഀ
                            new WixSharp.Shortcut(shortcuts, @"APPLICATIONROOTDIRECTORY"),਍                            渀攀眀 圀椀砀匀栀愀爀瀀⸀匀栀漀爀琀挀甀琀⠀猀栀漀爀琀挀甀琀猀Ⰰ 䀀∀─䐀攀猀欀琀漀瀀─∀⤀⤀Ⰰഀഀ
                        new File(binaries, @"AppFiles\Bin\MyApp.dll"),਍                        渀攀眀 圀椀砀匀栀愀爀瀀⸀匀栀漀爀琀挀甀琀⠀戀椀渀愀爀椀攀猀Ⰰ ∀唀渀椀渀猀琀愀氀氀 䰀漀挀愀氀椀稀愀琀椀漀渀 吀攀猀琀∀Ⰰ ∀嬀匀礀猀琀攀洀㘀㐀䘀漀氀搀攀爀崀洀猀椀攀砀攀挀⸀攀砀攀∀Ⰰ ∀⼀砀 嬀倀爀漀搀甀挀琀䌀漀搀攀崀∀⤀Ⰰഀഀ
਍                        ⼀⼀ 搀椀爀攀挀琀漀爀礀 眀椀琀栀 愀瀀瀀氀椀挀愀琀椀漀渀 搀愀琀愀ഀഀ
                        new Dir("Data",਍                            渀攀眀 䘀椀氀攀⠀搀愀琀愀猀Ⰰ 䀀∀䄀瀀瀀䘀椀氀攀猀尀䐀愀琀愀尀愀瀀瀀开搀愀琀愀⸀搀愀琀∀⤀⤀Ⰰഀഀ
਍                        ⼀⼀ 搀椀爀攀挀琀漀爀礀 眀椀琀栀 搀漀挀甀洀攀渀琀愀琀椀漀渀ഀഀ
                        new Dir("Doc",਍                            渀攀眀 䘀椀氀攀⠀搀漀挀猀Ⰰ 䀀∀䄀瀀瀀䘀椀氀攀猀尀䐀漀挀猀尀洀愀渀甀愀氀⸀琀砀琀∀⤀⤀⤀Ⰰഀഀ
਍                    ⼀⼀瀀爀漀最爀愀洀 洀攀渀甀 甀渀椀渀猀琀愀氀氀 猀栀漀爀琀挀甀琀ഀഀ
                    new Dir(@"%ProgramMenu%\Kosmii\KosmiiTest",਍                        渀攀眀 圀椀砀匀栀愀爀瀀⸀匀栀漀爀琀挀甀琀⠀猀栀漀爀琀挀甀琀猀Ⰰ ∀唀渀椀渀猀琀愀氀氀 䬀漀猀洀椀椀 吀攀猀琀∀Ⰰ ∀嬀匀礀猀琀攀洀㘀㐀䘀漀氀搀攀爀崀洀猀椀攀砀攀挀⸀攀砀攀∀Ⰰ ∀⼀砀 嬀倀爀漀搀甀挀琀䌀漀搀攀崀∀⤀⤀⤀㬀ഀഀ
਍            ⼀⼀ 猀攀琀 瀀爀漀樀攀挀琀 瀀爀漀瀀攀爀琀椀攀猀ഀഀ
            project.GUID = new Guid("6fe30b47-2577-43ad-9095-1861ba25889a");਍            瀀爀漀樀攀挀琀⸀唀瀀最爀愀搀攀䌀漀搀攀 㴀 渀攀眀 䜀甀椀搀⠀∀㘀昀攀㌀　戀㐀㜀ⴀ㈀㔀㜀㜀ⴀ㐀㌀愀搀ⴀ㤀　㤀㔀ⴀ㄀㠀㘀㄀戀愀㈀㔀㠀㠀㤀戀∀⤀㬀ഀഀ
            project.LicenceFile = @"AppFiles\License.rtf";਍            瀀爀漀樀攀挀琀⸀䰀愀渀最甀愀最攀 㴀 氀愀渀最㬀ഀഀ
            project.Encoding = System.Text.Encoding.UTF8;਍            瀀爀漀樀攀挀琀⸀䴀愀渀甀昀愀挀琀甀爀攀爀 㴀 䔀渀瘀椀爀漀渀洀攀渀琀⸀唀猀攀爀一愀洀攀㬀ഀഀ
            project.UI = WUI.WixUI_Mondo;਍            瀀爀漀樀攀挀琀⸀匀漀甀爀挀攀䈀愀猀攀䐀椀爀 㴀 䔀渀瘀椀爀漀渀洀攀渀琀⸀䌀甀爀爀攀渀琀䐀椀爀攀挀琀漀爀礀㬀ഀഀ
            project.MSIFileName = "LocalizationTest";਍ഀഀ
            Compiler.BuildMsi(project);਍        紀ഀഀ
        catch (System.Exception ex)਍        笀ഀഀ
            Console.WriteLine(ex.Message);਍        紀ഀഀ
    }਍紀ഀഀ
਍ഀഀ
਍ഀഀ
