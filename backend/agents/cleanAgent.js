const cleanAgent=async(array)=>{
const filtered=array.filter(product=>Object.keys(product).length>0)
const set=new Set();
const unique=filtered.filter(item=>
{
    const key=item.title +item.url;
    if(set.has(key)){
        return false;
    }
set.add(key);
return true;
}
)
return unique;
}
export { cleanAgent }