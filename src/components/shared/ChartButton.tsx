const ChartButton = ({ title, rate }: { title: string; rate: string }) => {
  return (
    <div className="px-3 py-2 bg-[#ECECEC] rounded-sm flex justify-around items-center gap-2 min-w-[164px]">
      <span className="text-[9px] font-thin">{title}</span>
      <span className="text-[9px] font-semibold">{rate}</span>
    </div>
  )
}

export default ChartButton;
