const ChartLabelBox = ({ title, rate }: { title: string; rate: string }) => {
  return (
    <div className="my-3 px-3 py-2 bg-[#ECECEC] rounded-md flex justify-around items-center gap-2 min-w-[164px]">
      <span className="text-[12px] font-normal">{title}</span>
      <span className="text-[12px] font-semibold">{rate}</span>
    </div>
  )
}

export default ChartLabelBox;
