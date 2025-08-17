import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './detailModal.scss'
import { useState } from 'react';
import { IoMdInformationCircle } from "react-icons/io";
import { FaTachometerAlt } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { handleflushing, completeMeterReplacement, updatedInSystem, completeProjectDocument, } from '../api/job-api'

const DetailJobModal = (props) => {

    const jobData = props.jobData
    const role = props.role
    const reloadJobList = props.reloadJobList
    const onHide = props.onHide

    const [serialNumber, setSerialNumber] = useState('');

    let completionDate = new Date(jobData?.updatedAt);
    completionDate.setDate(completionDate.getDate() + import.meta.env.VITE_DEADLINE_DAY);

    const renderButtons = (role, task_type) => {
        if (role === 'QLM' && task_type === 'QL Mạng') {
            return (
                <div>
                    <Button variant="primary" onClick={() => handleFlushing('Xúc xả thành công')} >Xúc xả thành công</Button>
                    <Button variant="danger" onClick={() => handleFlushing('Xúc xả thất bại')} className='ms-2'>Xúc xả thất bại</Button>
                </div>
            );
        }

        if (role === 'TT' && task_type === 'Thanh tra') {
            return (
                <div className="d-flex align-items-end gap-2">
                    <div className="flex-grow-1">
                        <label>Serial đồng hồ mới</label>
                        <input
                            type="text"
                            className="form-control"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="primary"
                        className="align-self-end"
                        onClick={() => handleCompleteMeterReplacement()}
                    >
                        Xác nhận
                    </Button>
                </div>
            );
        }

        if (role === 'KD' && task_type === 'Thanh tra') {
            return (
                <div>
                    <Button variant="primary" onClick={() => handleUpdatedInSystem()}>Cập nhật vào hệ thống</Button>
                </div>
            );
        }

        if (role === 'KT' && task_type === 'Kinh doanh') {
            return (
                <div>
                    <Button variant="primary" onClick={() => handleCompleteProjectDocument()} >Hoàn thiện hồ sơ</Button>
                </div>
            );
        }

        return null;

    }

    const handleFlushing = async (status) => {
        try {
            if (status === 'Xúc xả thất bại') {
                const res = await handleflushing(jobData.job_id, status)
                if (res.EC === 0) {
                    // Tắt modal
                    onHide();
                    // Reload danh sách công việc
                    reloadJobList();
                }
            }
            else {
                const res = await handleflushing(jobData.job_id, status)
                if (res.EC === 0) {
                    // Tắt modal
                    onHide();
                    // Reload danh sách công việc
                    reloadJobList();
                }
            }
        } catch (error) {
            console.log(error)
        }

    }

    const handleCompleteMeterReplacement = async () => {
        try {
            const serial_number = document.querySelector('input').value
            const res = await completeMeterReplacement(jobData.job_id, serial_number)
            if (res.EC === 0) {
                // Tắt modal
                onHide();
                // Reload danh sách công việc
                reloadJobList();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdatedInSystem = async () => {
        try {
            const res = await updatedInSystem(jobData.job_id)
            if (res.EC === 0) {
                // Tắt modal
                onHide();
                // Reload danh sách công việc
                reloadJobList();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCompleteProjectDocument = async () => {
        try {
            const res = await completeProjectDocument(jobData.job_id)
            if (res.EC === 0) {
                // Tắt modal
                onHide();
                // Reload danh sách công việc
                reloadJobList();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className='job-info'>
                        <div className='title '>
                            <IoMdInformationCircle className="icon" />
                            <span>Thông tin công việc</span>
                        </div>
                        <div >Mã công việc: {jobData.job_id}</div>
                        <div >Bộ phận phụ trách: {jobData.task_type}</div>
                        <div >Trạng thái: {jobData.status}</div>
                    </div>
                    <div className='gerneral-info gap-3 d-none d-md-flex'>
                        <div className='meter-info w-50'>
                            <div className='title'>
                                <FaTachometerAlt className="icon" />
                                <span>Thông tin đồng hồ</span>
                            </div>
                            <div>Serial đồng hồ lỗi: {jobData.OldMeter?.serial_number}</div>
                            <div>Số đọc đồng hồ: {jobData.meter_boook_number || 'Không có'}</div>
                            <div>Chỉ số đồng hồ: {jobData.meter_value || 'Không có'}</div>
                        </div>
                        <div className='customer-info w-50'>
                            <div className='title'>
                                <IoPersonSharp className="icon" />
                                <span>Thông tin khách hàng</span>
                            </div>
                            <div>Khách hàng: {jobData.customer_name}</div>
                            <div>Địa chỉ: {jobData.address}</div>
                        </div>
                    </div>
                    {/* Mobile */}
                    <div className='gerneral-info d-sm-flex flex-column gap-3 d-md-none '>
                        <div className='meter-info '>
                            <div className='title'>
                                <FaTachometerAlt className="icon" />
                                <span>Thông tin đồng hồ</span>
                            </div>
                            <div>Serial đồng hồ lỗi: {jobData.OldMeter?.serial_number}</div>
                            <div>Số đọc đồng hồ: {jobData.meter_boook_number || 'Không có'}</div>
                            <div>Chỉ số đồng hồ: {jobData.meter_value || 'Không có'}</div>
                        </div>
                        <div className='customer-info '>
                            <div className='title'>
                                <IoPersonSharp className="icon" />
                                <span>Thông tin khách hàng</span>
                            </div>
                            <div>Khách hàng: {jobData.customer_name}</div>
                            <div>Địa chỉ: {jobData.address}</div>
                        </div>
                    </div>
                    <div>Ngày tạo: {new Date(jobData.updatedAt).toLocaleDateString('vi-VN')}</div>
                    <div style={{ color: 'red' }}>Hạn hoàn thành: {new Date(completionDate).toLocaleDateString('vi-VN')}</div>
                    <div className='button-group d-flex justify-content-center '>
                        {renderButtons(role, jobData.task_type)}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DetailJobModal