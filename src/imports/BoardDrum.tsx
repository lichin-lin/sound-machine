import { imgCancel } from "./svg-peyyk";

function Logo() {
  return <div className="bg-white shrink-0 size-9" data-name="Logo" />;
}

function Title() {
  return <div className="basis-0 bg-white grow h-[38px] min-h-px min-w-px shrink-0" data-name="Title" />;
}

function AboutInfo() {
  return <div className="bg-white shrink-0 size-9" data-name="about/info" />;
}

function Title1() {
  return (
    <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full" data-name="Title">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-[11px] items-center justify-start p-[12px] relative w-full">
          <Logo />
          <Title />
          <AboutInfo />
        </div>
      </div>
    </div>
  );
}

function PlayPause() {
  return <div className="basis-0 bg-white grow h-9 min-h-px min-w-px shrink-0" data-name="play/pause" />;
}

function Valumn() {
  return <div className="basis-0 bg-white grow h-9 min-h-px min-w-px shrink-0" data-name="valumn" />;
}

function Tempo() {
  return <div className="basis-0 bg-white grow h-9 min-h-px min-w-px shrink-0" data-name="tempo" />;
}

function Setting() {
  return (
    <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full" data-name="setting">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-[11px] items-center justify-start p-[12px] relative w-full">
          <PlayPause />
          <Valumn />
          <Tempo />
        </div>
      </div>
    </div>
  );
}

function T1() {
  return <div className="bg-white shrink-0 size-9" data-name="t1" />;
}

function T2() {
  return <div className="bg-white shrink-0 size-9" data-name="t2" />;
}

function T3() {
  return <div className="bg-white shrink-0 size-9" data-name="t3" />;
}

function T4() {
  return <div className="bg-white shrink-0 size-9" data-name="t4" />;
}

function DrumType() {
  return <div className="basis-0 bg-[#dbdbdb] grow h-6 min-h-px min-w-px shrink-0" data-name="drum type" />;
}

function PianoType() {
  return <div className="basis-0 bg-[#dbdbdb] grow h-6 min-h-px min-w-px shrink-0" data-name="piano type" />;
}

function Type() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative shrink-0" data-name="type">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-center justify-start px-3 py-1.5 relative w-full">
          <DrumType />
          <PianoType />
        </div>
      </div>
    </div>
  );
}

function Tracks() {
  return (
    <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full" data-name="tracks">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-[11px] items-center justify-start p-[12px] relative w-full">
          <T1 />
          <T2 />
          <T3 />
          <T4 />
          <Type />
        </div>
      </div>
    </div>
  );
}

function T5() {
  return <div className="absolute bg-white h-9 left-[83px] top-0 w-[72px]" data-name="t2" />;
}

function DrumThemeOptions() {
  return (
    <div className="basis-0 bg-white grow h-9 min-h-px min-w-px overflow-clip relative shrink-0" data-name="drum theme options">
      <T5 />
    </div>
  );
}

function DrumDataPresets() {
  return <div className="basis-0 bg-white grow h-9 min-h-px min-w-px shrink-0" data-name="drum data presets" />;
}

function DrumSetting() {
  return (
    <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full" data-name="drum setting">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-[11px] items-center justify-start p-[12px] relative w-full">
          <DrumThemeOptions />
          <DrumDataPresets />
        </div>
      </div>
    </div>
  );
}

function Effect() {
  return (
    <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">bd</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bd() {
  return (
    <div className="[grid-area:1_/_1] bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-[72px]" data-name="bd">
      <Effect />
    </div>
  );
}

function Frame3() {
  return (
    <div className="[grid-area:1_/_1] bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap" style={{ top: "calc(50% - 6.75px)", left: "calc(50% - 7.25px)" }}>
        <p className="leading-[normal] whitespace-pre">bd</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="[grid-area:1_/_2] bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap" style={{ top: "calc(50% - 6.417px)", left: "calc(50% - 6.417px)" }}>
        <p className="leading-[normal] whitespace-pre">sd</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="[grid-area:1_/_3] bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap" style={{ top: "calc(50% - 6.417px)", left: "calc(50% - 6.417px)" }}>
        <p className="leading-[normal] whitespace-pre">hh</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="[grid-area:2_/_1] bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap" style={{ top: "calc(50% - 6.75px)", left: "calc(50% - 7.25px)" }}>
        <p className="leading-[normal] whitespace-pre">bd</p>
      </div>
    </div>
  );
}

function Cancel() {
  return (
    <div className="[grid-area:2_/_2] relative shrink-0" data-name="cancel">
      <img className="block max-w-none size-full" src={imgCancel} />
    </div>
  );
}

function Frame8() {
  return (
    <div className="[grid-area:2_/_3] bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap" style={{ top: "calc(50% - 6.75px)", left: "calc(50% - 7.25px)" }}>
        <p className="leading-[normal] whitespace-pre">bd</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="[grid-area:3_/_1] bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap" style={{ top: "calc(50% - 6.75px)", left: "calc(50% - 7.25px)" }}>
        <p className="leading-[normal] whitespace-pre">bd</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="[grid-area:3_/_2] bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap" style={{ top: "calc(50% - 6.75px)", left: "calc(50% - 7.25px)" }}>
        <p className="leading-[normal] whitespace-pre">bd</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="[grid-area:3_/_3] bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap" style={{ top: "calc(50% - 6.75px)", left: "calc(50% - 7.25px)" }}>
        <p className="leading-[normal] whitespace-pre">bd</p>
      </div>
    </div>
  );
}

function Effect1() {
  return (
    <div className="basis-0 bg-[dimgrey] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="overflow-clip relative size-full">
        <div className="box-border gap-0.5 grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(3,_minmax(0px,_1fr))] p-[2px] relative size-full">
          <Frame3 />
          <Frame4 />
          <Frame5 />
          <Frame6 />
          <Cancel />
          <Frame8 />
          <Frame9 />
          <Frame10 />
          <Frame11 />
        </div>
      </div>
    </div>
  );
}

function Selecting() {
  return (
    <div className="[grid-area:1_/_2] bg-white relative shrink-0" data-name="selecting">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-[4px] relative size-full">
          <Effect1 />
        </div>
      </div>
    </div>
  );
}

function Effect2() {
  return (
    <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">hh</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hh() {
  return (
    <div className="[grid-area:1_/_3] bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-[72px]" data-name="hh">
      <Effect2 />
    </div>
  );
}

function Effect3() {
  return (
    <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">bd</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="[grid-area:2_/_1] bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-[72px]" data-name="Cell">
      <Effect3 />
    </div>
  );
}

function Effect4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="size-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Empty() {
  return (
    <div className="[grid-area:2_/_2] relative rounded-[2px] shrink-0" data-name="empty">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[4px] relative size-full">
          <Effect4 />
        </div>
      </div>
    </div>
  );
}

function Effect5() {
  return (
    <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">hh</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="[grid-area:2_/_3] bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-[72px]" data-name="Cell">
      <Effect5 />
    </div>
  );
}

function Effect6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="size-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Empty1() {
  return (
    <div className="[grid-area:2_/_4] relative rounded-[2px] shrink-0" data-name="empty">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[4px] relative size-full">
          <Effect6 />
        </div>
      </div>
    </div>
  );
}

function Effect7() {
  return (
    <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">sd</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="[grid-area:3_/_1] bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-[72px]" data-name="Cell">
      <Effect7 />
    </div>
  );
}

function Effect8() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="size-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Empty2() {
  return (
    <div className="[grid-area:3_/_2] relative rounded-[2px] shrink-0" data-name="empty">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[4px] relative size-full">
          <Effect8 />
        </div>
      </div>
    </div>
  );
}

function Effect9() {
  return (
    <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">bd</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="[grid-area:3_/_3] bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-[72px]" data-name="Cell">
      <Effect9 />
    </div>
  );
}

function Effect10() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="size-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Empty3() {
  return (
    <div className="[grid-area:3_/_4] relative rounded-[2px] shrink-0" data-name="empty">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[4px] relative size-full">
          <Effect10 />
        </div>
      </div>
    </div>
  );
}

function Effect11() {
  return (
    <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">bd</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="[grid-area:4_/_1] bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-[72px]" data-name="Cell">
      <Effect11 />
    </div>
  );
}

function Effect12() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="size-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Empty4() {
  return (
    <div className="[grid-area:4_/_2] relative rounded-[2px] shrink-0" data-name="empty">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[4px] relative size-full">
          <Effect12 />
        </div>
      </div>
    </div>
  );
}

function Effect13() {
  return (
    <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">bd</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="[grid-area:4_/_3] bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-[72px]" data-name="Cell">
      <Effect13 />
    </div>
  );
}

function Effect14() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="size-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Empty5() {
  return (
    <div className="[grid-area:4_/_4] relative rounded-[2px] shrink-0" data-name="empty">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[4px] relative size-full">
          <Effect14 />
        </div>
      </div>
    </div>
  );
}

function Effect15() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full" data-name="effect">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="size-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Empty6() {
  return (
    <div className="[grid-area:1_/_4] box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[4px] relative rounded-[2px] shrink-0 size-[72px]" data-name="empty">
      <Effect15 />
    </div>
  );
}

function DrumSounds() {
  return (
    <div className="bg-white box-border gap-1 grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(4,_minmax(0px,_1fr))] overflow-clip p-[4px] relative rounded-[2px] shrink-0 size-[310px]" data-name="drum sounds">
      <Bd />
      <Selecting />
      <Hh />
      <Cell />
      <Empty />
      <Cell1 />
      <Empty1 />
      <Cell2 />
      <Empty2 />
      <Cell3 />
      <Empty3 />
      <Cell4 />
      <Empty4 />
      <Cell5 />
      <Empty5 />
      <Empty6 />
    </div>
  );
}

function DrumSoundPanelIn16Hole() {
  return (
    <div className="bg-[#4d4d4d] relative rounded-[4px] shrink-0 w-full" data-name="drum sound panel in 16 hole">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-2.5 items-center justify-start p-[12px] relative w-full">
          <DrumSounds />
        </div>
      </div>
    </div>
  );
}

export default function BoardDrum() {
  return (
    <div className="bg-[#212121] relative size-full" data-name="board / drum">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[13px] items-start justify-start p-[16px] relative size-full">
          <Title1 />
          <Setting />
          <Tracks />
          <DrumSetting />
          <DrumSoundPanelIn16Hole />
        </div>
      </div>
    </div>
  );
}